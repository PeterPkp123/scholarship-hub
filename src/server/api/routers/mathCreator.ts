import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getShuntingResponse } from "~/utils/shunting-yard";
import { createMathTestSchema } from "~/pages/math/creator/create";
import { type Prisma } from "@prisma/client";
import { ApiError } from "../errors/api-error";
import { checkMathTestAnswerSchema } from "~/pages/math/creator/test/[id]/test";

export const mathCreatorRouter = createTRPCRouter({
  createTest: publicProcedure
    .input(createMathTestSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.questions.length === 0)
        throw new ApiError("Musisz dodać przynajmniej jedno pytanie!", "name");

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
          graph = {
            create: {
              infix: inputQ.graph,
              rpn,
              values: JSON.stringify(graphV.plotValues),
            },
          };
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
        include: { questions: { include: { answers: true, graph: true } } },
      });
    }),
  getOneTestPractice: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.mathTest.findUnique({
        where: { id: input.id },
        include: {
          questions: { include: { graph: { select: { values: true } } } },
        },
      });
    }),
  checkAnswer: publicProcedure
    .input(checkMathTestAnswerSchema)
    .mutation(async ({ ctx, input }) => {
      const question = await ctx.prisma.mathQuestion.findUnique({
        where: { id: input.questionId },
        include: { answers: true },
      });

      if (!question) throw new ApiError("Nie znaleziono pytania", "answer");

      const correct = !!question.answers.find(
        (a) => a.content === input.answer
      );

      return {
        correct,
        correctAnswer: question.answers[0]?.content ?? "",
      };
    }),
  deleteTest: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.mathTest.delete({
        where: { id: input.id },
      });
    }),
});
