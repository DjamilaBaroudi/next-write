import { postRouter } from "./routers/post";
import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/user";
import { tagRouter } from "./routers/tag";
import { unsplashRouter } from "./routers/unsplash";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
    post: postRouter,
    user: userRouter,
    tag: tagRouter,
    unsplach: unsplashRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
