/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import slugify from "slugify";
import { z } from "zod";
import { WriteFormSchema } from "../../../components/WriteFormModal";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
    createPost: protectedProcedure.input(
        WriteFormSchema
    ).mutation(
        async ({ ctx: { prisma, session }, input: { title, description, text } }) => {
            await prisma.post.create({
                data: {
                    title,
                    text,
                    description,
                    slug: slugify(title),
                    authorId: session.user.id
                }
            })
        }
    ),
    getPosts: publicProcedure.query(
        async ({ ctx: { prisma } }) => {
            const posts = await prisma.post.findMany(
                {
                    orderBy: {
                        created_at: 'desc'
                    },
                    include: {
                        author: {
                            select: {
                                name: true,
                                image: true,

                            }
                        }
                    }
                }
            );
            return posts;
        }),

    getPost: publicProcedure.input(
        z.object({
            slug: z.string()
        })
    ).query(
        async ({ ctx: { prisma, session }, input: { slug } }) => {
            const post = await prisma.post.findUnique({
                where: {
                    slug,
                },
                select: {
                    id: true,
                    text: true,
                    title: true,
                    description: true,
                    likes: session?.user.id ? {
                        where: {
                            userId: session?.user.id
                        }
                    } : false
                }
            })
            return post
        }),

    likePost: protectedProcedure.input(
        z.object({
            postId: z.string()
        })
    ).mutation(
        async ({ ctx: { prisma, session }, input: { postId } }) => {
            await prisma.like.create({
                data: {
                    userId: session.user.id,
                    postId
                }
            })
        }
    ),
    dislikePost: protectedProcedure.input(
        z.object({
            postId: z.string()
        })
    ).mutation(
        async ({ ctx: { prisma, session }, input: { postId } }) => {
            await prisma.like.delete({
                where: {
                    userId_postId: {
                        postId: postId,
                        userId: session.user.id
                    }
                }
            })
        }
    )
})