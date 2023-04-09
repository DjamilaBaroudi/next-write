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
            posId: z.string(),
        })
    ).query(async ({ ctx: { prisma }, input }) => {
        return await prisma.post.findUnique({
            where: {
                id: input.posId,
            },
            select: {
                tags: {
                    select: {
                        name: true, 
                        description: true,
                    }
                }
            }
        })
    }),
    getAllTags: publicProcedure.query(async ({ctx: { prisma }}) => {
        return await prisma.tag.findMany({
            select: {
                id: true,
                name: true,
                description: true,
            }
        })
    })
})