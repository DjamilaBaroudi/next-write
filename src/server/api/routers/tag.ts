import { TRPCError } from '@trpc/server'
import slugify from 'slugify'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'
import { TagFormSchema } from '../../../components/TagForm'
import { z } from 'zod'

export const tagRouter = createTRPCRouter({
    createTag: protectedProcedure.input(
        TagFormSchema
    ).mutation(async ({ ctx: { prisma }, input }) => {
        const tag = await prisma.tag.findUnique({
            where: {
                name: input.name
            }
        })
        if (tag) {
            throw new TRPCError({ code: 'CONFLICT', message: 'Tag already exists!' })
        }
        await prisma.tag.create({
            data: {
                ...input,
                slug: slugify(input.name)
            }
        })
    }),
    getTagsForPost: publicProcedure.input(
        z.object({
            postId: z.string(),
        })
    ).query(async ({ ctx: { prisma }, input }) => {
        return await prisma.post.findUnique({
            where: {
                id: input.postId,
            },
            select: {
                tags: {
                    select: {
                        name: true,
                        description: true,
                        slug: true,
                        id: true,
                    }
                }
            }
        })
    }),
    getAllTags: publicProcedure.query(async ({ ctx: { prisma } }) => {
        return await prisma.tag.findMany({
            select: {
                name: true,
                id:true,
                _count: {
                    select: {
                        posts: true,
                    }
                }
            },
        })
    }),
})

