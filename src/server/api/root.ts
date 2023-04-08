import { createTRPCRouter } from "~/server/api/trpc";
import { englishLearnRouter } from "./routers/englishLearn";
import { mathAnalyzerRouter } from "./routers/mathAnalyzer";
import { mathCreatorRouter } from "./routers/mathCreator";

export const appRouter = createTRPCRouter({
  englishLearn: englishLearnRouter,
  mathAnalyzer: mathAnalyzerRouter,
  mathCreator: mathCreatorRouter,
});

export type AppRouter = typeof appRouter;
