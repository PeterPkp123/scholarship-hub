import { z } from "zod";
import { createVocabSetSchema } from "~/pages/english/learn";
import { addWordSchema } from "~/pages/english/learn/[setId]";
import { checkVocabAnswerSchema } from "~/pages/english/learn/[setId]/practice";
import { getWord } from "~/utils/get-word-definitions";
import { ApiError } from "../errors/api-error";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const englishLearnRouter = createTRPCRouter({
  createSet: publicProcedure
    .input(createVocabSetSchema)
    .mutation(async ({ ctx, input }) => {
      const setsWithSameName = await ctx.prisma.vocabSet.count({
        where: {
          name: input.name,
        },
      });

      if (setsWithSameName > 0) {
        throw new ApiError("A set with this name already exists", "name");
      }

      await ctx.prisma.vocabSet.create({
        data: {
          name: input.name,
        },
      });
    }),
  getSets: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.vocabSet.findMany({
      include: { _count: { select: { words: true } } },
    });
  }),
  getSet: publicProcedure
    .input(z.object({ setId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.vocabSet.findUnique({
        where: { id: input.setId },
        include: {
          words: {
            include: {
              meanings: { include: { definitions: true } },
              phonetics: true,
            },
          },
        },
      });
    }),
  getSetPractice: publicProcedure
    .input(z.object({ setId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const vocabSet = await ctx.prisma.vocabSet.findUnique({
        where: { id: input.setId },
        include: {
          words: {
            select: {
              meanings: {
                select: { partOfSpeech: true, definitions: true, id: true },
              },
              phonetics: true,
              id: true,
              content: true,
            },
          },
        },
      });

      if (!vocabSet) {
        throw new ApiError("This set does not exist", "setId");
      }

      if (vocabSet.words.length === 0) {
        throw new ApiError("This set is empty", "setId");
      }

      return {
        ...vocabSet,
        words: vocabSet.words
          .sort(() => Math.random() - 0.5)
          .map((w) => ({ ...w, content: null })),
      };
    }),
  addWord: publicProcedure
    .input(addWordSchema)
    .mutation(async ({ ctx, input }) => {
      const set = await ctx.prisma.vocabSet.findUnique({
        where: { id: input.setId },
      });

      if (!set) {
        throw new ApiError("This set does not exist", "setId");
      }

      const sameWord = await ctx.prisma.word.findUnique({
        where: {
          content: input.word.toLocaleLowerCase(),
        },
        include: { vocabSets: { select: { id: true } } },
      });

      if (
        !!sameWord &&
        sameWord.vocabSets.some((set) => set.id === input.setId)
      ) {
        throw new ApiError("This word already exists in this set", "word");
      }

      if (!!sameWord) {
        await ctx.prisma.vocabSet.update({
          where: { id: input.setId },
          data: {
            words: {
              connect: {
                id: sameWord.id,
              },
            },
          },
        });

        return;
      }

      const word = await getWord(input.word);

      if (!word) {
        throw new ApiError("This word does not exist", "word");
      }

      const definitionCount = word.meanings.reduce(
        (acc, meaning) => acc + meaning.definitions.length,
        0
      );

      if (definitionCount === 0) {
        throw new ApiError(
          "Could not find any definitions for this word",
          "word"
        );
      }

      const newWord = await ctx.prisma.word.create({
        data: {
          content: input.word.toLocaleLowerCase(),
          phonetics: {
            createMany: {
              data: word.phonetics.map((phonetic) => ({
                content: phonetic.text,
                audioUrl: phonetic.audio,
              })),
            },
          },
          vocabSets: { connect: { id: input.setId } },
        },
      });

      word.meanings.forEach(async (meaning) => {
        await ctx.prisma.meaning.create({
          data: {
            partOfSpeech: meaning.partOfSpeech,
            word: { connect: { id: newWord.id } },
            definitions: {
              createMany: {
                data: meaning.definitions.map((definition) => ({
                  content: definition.definition,
                })),
              },
            },
          },
        });
      });
    }),
  removeWord: publicProcedure
    .input(z.object({ setId: z.string().min(1), wordId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const word = await ctx.prisma.word.findUnique({
        where: { id: input.wordId },
        include: { vocabSets: { select: { id: true } } },
      });

      if (!word) {
        throw new ApiError("This word does not exist", "wordId");
      }

      if (!word.vocabSets.some((set) => set.id === input.setId)) {
        throw new ApiError("This word does not exist in this set", "wordId");
      }

      await ctx.prisma.word.update({
        where: { id: input.wordId },
        data: {
          vocabSets: {
            disconnect: {
              id: input.setId,
            },
          },
        },
      });
    }),
  checkAnswer: publicProcedure
    .input(checkVocabAnswerSchema)
    .mutation(async ({ ctx, input }) => {
      const word = await ctx.prisma.word.findUnique({
        where: { id: input.wordId },
      });

      if (!word) {
        throw new ApiError("This word does not exist", "wordId");
      }

      return {
        currect: word.content === input.answer.toLocaleLowerCase(),
        word: word.content,
      };
    }),
  deleteSet: publicProcedure
    .input(z.object({ setId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const set = await ctx.prisma.vocabSet.findUnique({
        where: { id: input.setId },
      });

      if (!set) {
        throw new ApiError("This set does not exist", "setId");
      }

      await ctx.prisma.vocabSet.delete({
        where: { id: input.setId },
      });
    }),
});
