import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getShuntingResponse } from "~/utils/shunting-yard";
import { createMathTestSchema } from "~/pages/math/creator/create";
import { Prisma } from "@prisma/client";

export const mathCreatorRouter = createTRPCRouter({
  createTest: publicProcedure
    .input(createMathTestSchema)
    .mutation(async ({ ctx, input }) => {
      const test = await ctx.prisma.mathTest.create({
        data: {
          name: input.name,
          questions: {
            createMany: {
              data: input.questions.map((question) => ({
                content: question.content,
              })),
            },
          },
        },
        select: { questions: true },
      });

      test.questions.forEach(async (question) => {
        const inputQ = input.questions.find(
          (q) => q.content === question.content
        )!;

        let graph:
          | Prisma.MathGraphUncheckedUpdateOneWithoutMathQuestionNestedInput
          | Prisma.MathGraphUpdateOneWithoutMathQuestionNestedInput
          | undefined = undefined;

        if (inputQ.graph) {
          const graphV = getShuntingResponse(inputQ.graph);
          const rpn = graphV.reversedPolishNotation.join(" ");
          graph = { create: { infix: inputQ.graph, rpn } };
        }

        await ctx.prisma.mathQuestion.update({
          where: { id: question.id },
          data: { graph, answers: { create: { content: inputQ.answer } } },
        });
      });
    }),
  getAllTests: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.mathTest.findMany({
      include: { _count: { select: { questions: true } } },
    });
  }),
  getOneTest: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.mathTest.findUnique({
        where: { id: input.id },
        include: { questions: true },
      });
    }),
  deleteTest: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.mathTest.delete({
        where: { id: input.id },
      });
    }),
});
