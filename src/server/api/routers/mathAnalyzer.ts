import { processEquationSchema } from "~/pages/math/analyzer";
import { getShuntingResponse } from "~/utils/shunting-yard";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const mathAnalyzerRouter = createTRPCRouter({
  processEquation: publicProcedure
    .input(processEquationSchema)
    .mutation(({ input }) => {
      return getShuntingResponse(input.equation, input.variableValue);
    }),
});
