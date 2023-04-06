import { TRPCError } from '@trpc/server'
import slugify from 'slugify'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { TagFormSchema } from '../../../components/TagForm'

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
    })
})