import { z } from "zod";

export const getWord = async (word: string) => {
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );

  const responseSchema = z.array(
    z.object({
      word: z.string(),
      phonetics: z.array(
        z.object({
          text: z.string().optional(),
          audio: z.string(),
        })
      ),
      meanings: z.array(
        z.object({
          partOfSpeech: z.string(),
          definitions: z.array(
            z.object({
              definition: z.string(),
              synonyms: z.array(z.string()),
              antonyms: z.array(z.string()),
            })
          ),
        })
      ),
    })
  );

  const parseResult = responseSchema.safeParse(await response.json());

  if (!parseResult.success || parseResult.data.length === 0) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return parseResult.data[0]!;
};
