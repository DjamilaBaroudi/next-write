import slugify from "slugify";
import { TypeOf, z } from "zod";
import { WriteFormSchema } from "../../../components/WriteFormModal";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const LIMIT = 10;
export const postRouter = createTRPCRouter({
    createPost: protectedProcedure.input(
        WriteFormSchema.and(
            z.object({
                tagsIds: z.array(z.object(
                    {
                        id: z.string()
                    }
                )).optional()
            })
        )
    ).mutation(
        async ({ ctx: { prisma, session }, input: { title, description, text, tagsIds, html } }) => {
            await prisma.post.create({
                data: {
                    title,
                    text,
                    html,
                    description,
                    slug: slugify(title),
                    author: {
                        connect: {
                            id: session.user.id
                        }
                    },
                    tags: {
                        connect: tagsIds
                    }
                }
            })
        }
    ),
    getPosts: publicProcedure.input(z.object({
        cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
    })).query(
        async ({ ctx: { prisma, session }, input: { cursor } }) => {
            const posts = await prisma.post.findMany(
                {
                    orderBy: {
                        created_at: 'desc'
                    },
                    select: {
                        title: true,
                        description: true,
                        slug: true,
                        html: true,
                        id: true,
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
                        tags: {
                            select: {
                                name: true,
                                id: true,
                                slug: true
                            }
                        }

                    },
                    cursor: cursor ? { id: cursor } : undefined,
                    take: LIMIT + 1,
                });
            let nextCursor: typeof cursor | undefined = undefined
            if (posts.length > LIMIT) {
                const nextItem = posts.pop()
                if(nextItem) nextCursor = nextItem.id;
            }
            return {
                posts,
                nextCursor,
            }
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
                    html: true,
                    title: true,
                    description: true,
                    likes: session?.user.id ? {
                        where: {
                            userId: session?.user.id
                        }
                    } : false,
                    authorId: true,
                    slug: true,
                    featuredImage: true,
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
                                    username: true,
                                }
                            }
                        },
                    },

                }
            })
            return allBookmarkedPosts
        }
    ),
    updatePostFeturedImage: protectedProcedure.input(
        z.object({
            imageUrl: z.string().url(),
            postId: z.string()
        })).mutation(async ({ ctx: { prisma, session }, input: { imageUrl, postId } }) => {
            const postData = await prisma.post.findUnique({
                where: {
                    id: postId
                }
            })
            if (postData?.authorId !== session.user.id) {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'you are not the owner of this post' })
            }
            await prisma.post.update({
                where: {
                    id: postId
                },
                data: {
                    featuredImage: imageUrl
                }
            })
        }),

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

