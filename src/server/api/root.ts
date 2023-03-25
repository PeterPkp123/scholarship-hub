import { createTRPCRouter } from "~/server/api/trpc";
import { englishLearnRouter } from "./routers/englishLearn";
import { mathAnalyzerRouter } from "./routers/mathAnalyzer";

export const appRouter = createTRPCRouter({
  englishLearn: englishLearnRouter,
  mathAnalyzer: mathAnalyzerRouter,
});

export type AppRouter = typeof appRouter;
