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
    ).query(async ({ ctx: { prisma, session }, input: { username } }) => {
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
                        followedBy: true,
                        following: true,
                    }
                },
                followedBy: session?.user.id ? {
                    where: {
                        id: session?.user.id
                    }
                } : false
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
                        html: true,
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
    getCurrentUser: protectedProcedure.query(async ({ ctx: { prisma, session } }) => {
        return await prisma.user.findUnique({
            where: {
                id: session.user.id
            },
            select: {
                username: true,
            }
        })
    })
    ,
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
    }),
    getSuggestions: protectedProcedure.query(
        async ({ ctx: { prisma, session } }) => {
            const tagsQuery = {
                where: {
                    userId: session.user.id
                },
                select: {
                    post: {
                        select: {
                            tags: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                },
                take: 10,
            }
            const likedPostsTags = await prisma.like.findMany(tagsQuery);
            const bookmarkedPostsTags = await prisma.bookmark.findMany(tagsQuery);
            const interestedTags: string[] = [];

            likedPostsTags.forEach((like) => {
                interestedTags.push(...like.post.tags.map((tag) => tag.name))
            })
            bookmarkedPostsTags.forEach((bookmark) => {
                interestedTags.push(...bookmark.post.tags.map((tag) => tag.name))
            })

            const suggestedTagsQuery = {
                some: {
                    post: {
                        tags: {
                            some: {
                                name: {
                                    in: interestedTags
                                }
                            }
                        }
                    }
                }
            }
            const suggestions = await prisma.user.findMany({
                where: {
                    OR: [{ likes: suggestedTagsQuery }, { bookmarks: suggestedTagsQuery }],
                    NOT: {
                        id: session.user.id
                    }
                },
                select: {
                    id: true,
                    name: true,
                    image: true,
                    username: true,
                },
                take: 4,
            });
            return suggestions
        }
    ),

    followUser: protectedProcedure.input(
        z.object({
            followingUserID: z.string()
        })
    ).mutation(async ({ ctx: { prisma, session }, input: { followingUserID } }) => {
        if (followingUserID === session.user.id) {
            throw new TRPCError({
                message: 'You can\'t follow your self',
                code: 'BAD_REQUEST'
            })
        }
        await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                following: {
                    connect: {
                        id: followingUserID,
                    }
                }
            }
        })

    }

    ),

    unfollowUser: protectedProcedure.input(
        z.object({
            followingUserID: z.string()
        })).mutation(async ({ ctx: { prisma, session }, input: { followingUserID } }) => {
            await prisma.user.update({
                where: {
                    id: session.user.id
                },
                data: {
                    following: {
                        disconnect: {
                            id: followingUserID
                        }
                    }
                }

            })
        }),

    getFollowingUsers: protectedProcedure.input(
        z.object({
            userID: z.string()
        })
    ).query(
        async ({ ctx: { prisma }, input: { userID } }) => {
            return await prisma.user.findUnique({
                where: {
                    id: userID
                },
                select: {
                    following: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            image: true,
                        }
                    }
                }
            })
        }
    ),

    getFollowedByUsers: protectedProcedure.input(z.object({
        userID: z.string()
    })).query(
        async ({ ctx: { prisma, session }, input:{userID} }) => {
            return await prisma.user.findUnique({
                where: {
                    id: userID
                },
                select: {
                    followedBy: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            image: true,
                            followedBy: {
                                where: {
                                    id: session.user.id
                                }
                            }

                        }
                    }
                }
            })
        }
    )
})


