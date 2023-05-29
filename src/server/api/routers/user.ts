import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"
import { z } from 'zod'
import { decode } from 'base64-arraybuffer'
import { createClient } from '@supabase/supabase-js'
import isDataURI from 'validator/lib/isDataURI'
import { TRPCError } from "@trpc/server"

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_PUBLIC_URL as string, process.env.SUPABASE_SECRET_KEY as string)

export const userRouter = createTRPCRouter({
    getUserProfile: publicProcedure.input(
        z.object({
            username: z.string(),
        })
    ).query(async ({ ctx: { prisma }, input: { username } }) => {
        return await prisma.user.findUnique({
            where: {
                username
            },
            select: {
                name: true,
                image: true,
                id: true,
                username: true,
                _count: {
                    select: {
                        posts: true,
                    }
                }
            }
        })
    }),

    getCurrentUserPosts: publicProcedure.input(
        z.object({
            username: z.string(),
        })
    ).query(async ({ ctx: { prisma, session }, input: { username } }) => {
        return await prisma.user.findUnique({
            where: {
                username
            },
            select: {
                posts: {
                    select: {
                        id: true,
                        slug: true,
                        title: true,
                        description: true,
                        created_at: true,
                        featuredImage: true,
                        author: {
                            select: {
                                name: true,
                                image: true,
                                username: true,
                            }
                        },
                        bookmarks: session?.user.id ? {
                            where: {
                                userId: session?.user.id
                            }
                        } : false,

                    }
                }
            }
        })
    }),
    uploadAvatar: protectedProcedure.input(
        z.object({
            imageAsDataUrl: z.string().refine(val => isDataURI(val)),
            username: z.string()
        })
    ).mutation(async ({ ctx: { prisma, session }, input }) => {
        const imageBase64Str = input.imageAsDataUrl.replace(/^.+,/, "")
        /*  const user = await prisma.user.findUnique({
             where: {
                 username: input.username
             },
             select: {
                 username: true,
             }
         }) */
        const { data, error } = await supabase
            .storage
            .from('public')
            .upload(`avatars/${input.username}.png`, decode(imageBase64Str), {
                contentType: 'image/png',
                upsert: true
            });

        if (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: 'Upload failed to supabase'
            })
        }

        const { data: { publicUrl } } = supabase.storage.from("public").getPublicUrl(data.path);

        await prisma.user.update({
            data: {
                image: publicUrl
            },
            where: {
                id: session.user.id,
            }
        })
    })
})


