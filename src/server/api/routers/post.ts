import slugify from "slugify";
import { z } from "zod";
import { WriteFormSchema } from "../../../components/WriteFormModal";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
    createPost: protectedProcedure.input(
        WriteFormSchema.and(
            z.object({
                tagID: z.string().optional()
            })
        )
    ).mutation(
        async ({ ctx: { prisma, session }, input: { title, description, text, tagID } }) => {
            await prisma.post.create({
                data: {
                    title,
                    text,
                    description,
                    slug: slugify(title),
                    author: {
                        connect: {
                            id: session.user.id
                        }
                    },
                    tags: {
                        connect: {
                            id: tagID
                        }
                    }
                }
            })
        }
    ),
    getPosts: publicProcedure.query(
        async ({ ctx: { prisma, session } }) => {
            const posts = await prisma.post.findMany(
                {
                    orderBy: {
                        created_at: 'desc'
                    },
                    select: {
                        title: true,
                        description: true,
                        slug: true,
                        id: true,
                        created_at: true,
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
                        tags: {
                            select: {
                                name: true,
                                id: true,
                                slug: true
                            }
                        }

                    },
                    take: 10,
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
    ),

    bookmarkPost: protectedProcedure.input(
        z.object({
            postId: z.string()
        })
    ).mutation(
        async ({ ctx: { prisma, session }, input: { postId } }) => {
            await prisma.bookmark.create({
                data: {
                    userId: session.user.id,
                    postId: postId
                }
            })
        }
    ),
    removeBookmarkPost: protectedProcedure.input(
        z.object({
            postId: z.string()
        })
    ).mutation(
        async ({ ctx: { prisma, session }, input: { postId } }) => {
            await prisma.bookmark.delete({
                where: {
                    userId_postId: {
                        userId: session.user.id,
                        postId
                    }
                }
            })
        }
    ),
    createComment: protectedProcedure.input(
        z.object({
            text: z.string().min(5),
            postId: z.string()
        })
    ).mutation(async ({ ctx: { prisma, session }, input: { text, postId } }) => {
        await prisma.comment.create({
            data: {
                text,
                user: {
                    connect: {
                        id: session.user.id
                    }
                },
                post: {
                    connect: {
                        id: postId
                    }
                }
            }
        })
    }),
    getComments: publicProcedure.input(
        z.object({
            postId: z.string()
        })).query(
            async ({ ctx: { prisma }, input: { postId } }) => {
                const comments = await prisma.comment.findMany({
                    orderBy: {
                        created_at: 'desc'
                    },
                    where: {
                        postId
                    },
                    select: {
                        id: true,
                        text: true,
                        created_at: true,
                        user: {
                            select: {
                                image: true,
                                name: true,
                            }
                        }
                    }
                })
                return comments
            }),
    getBookmarkedPosts: protectedProcedure.query(
        async ({ ctx: { prisma, session } }) => {
            const allBookmarkedPosts = await prisma.bookmark.findMany({
                where: {
                    userId: session.user.id,
                },
                take: 4,
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    id: true,
                    post: {
                        select: {
                            title: true,
                            description: true,
                            created_at: true,
                            slug: true,
                            author: {
                                select: {
                                    name: true,
                                    image: true,
                                }
                            }
                        },
                    },

                }
            })
            return allBookmarkedPosts
        }
    ),
  /*   getTagedPosts: publicProcedure.input(
        z.object(
            {
                tagID: z.string().optional()
            })
    ).query(
        async ({ ctx: { prisma, session }, input: { tagID } }) => {
            const posts = await prisma.post.findMany({
                where: {
                    tags: {
                        
                    }
                },
                select: {
                    posts: {
                        orderBy: {
                            created_at: 'desc'
                        },
                        select: {
                            title: true,
                            description: true,
                            slug: true,
                            id: true,
                            created_at: true,
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
                            tags: {
                                select: {
                                    name: true,
                                    id: true, 
                                    slug: true,
                                    description: true,
                                }
                            }
                        }
                    }
                }
                })
                
                return posts;
            }),*/
}) 

