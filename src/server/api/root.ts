import { createTRPCRouter } from "~/server/api/trpc";
import { englishLearnRouter } from "./routers/englishLearn";

export const appRouter = createTRPCRouter({
  englishLearn: englishLearnRouter,
});

export type AppRouter = typeof appRouter;
