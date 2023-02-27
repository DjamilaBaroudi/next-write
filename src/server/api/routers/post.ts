/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import slugify from "slugify";
import { WriteFormSchema } from "../../../components/WriteFormModal";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
    createPost: protectedProcedure.input(
        WriteFormSchema
    ).mutation(
        async ({ ctx: { prisma, session }, input: { title, description, text } }) => {
            if(!title){
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
            else {
                console.log('title already exists!')
            }
        }
    )
})