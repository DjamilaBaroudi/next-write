/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import slugify from "slugify";
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
        }
    )

})