import { zodResolver } from "@hookform/resolvers/zod";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AppLayout from "~/components/app-layout";
import { Label } from "~/components/label";
import Loading from "~/components/loading";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/toast";
import { api, type RouterInputs } from "~/utils/api";
import { useQueryParams } from "~/utils/use-query-params";

export const checkVocabAnswerSchema = z.object({
  wordId: z.string().min(1),
  answer: z.string().min(1),
});

const Pracice: NextPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const { setId } = useQueryParams({ setId: z.string() });

  const { data, isLoading, isError } = api.englishLearn.getSetPractice.useQuery(
    { setId: setId || "" },
    { enabled: !!setId, refetchOnWindowFocus: false, cacheTime: 0 }
  );

  const {
    mutateAsync,
    isLoading: isCheckingWord,
    error: apiErrors,
  } = api.englishLearn.checkAnswer.useMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors },
  } = useForm<RouterInputs["englishLearn"]["checkAnswer"]>({
    resolver: zodResolver(checkVocabAnswerSchema),
    defaultValues: {
      wordId: "__WORD_ID__",
    },
  });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const result = await mutateAsync({
        ...formData,
        wordId: data?.words[currentIndex]?.id ?? "__MISSING_WORD_ID__",
      });

      if (result.currect) {
        setCorrectAnswers((c) => c + 1);
        toast({
          title: "Correct!",
          description: (
            <span>
              The word was indeed <b>{result.word}</b>!
            </span>
          ),
        });
      } else {
        toast({
          title: "Incorrect!",
          description: (
            <span>
              The correct answer is: <b>{result.word}</b>!
            </span>
          ),
        });
      }

      if (currentIndex + 1 < (data?.words.length ?? 0)) {
        setCurrentIndex((c) => c + 1);
      } else {
        setResultDialogOpen(true);
      }

      reset();
    } catch (e) {}
  });

  if (!data || isLoading || isError)
    return (
      <AppLayout enLang title={"Loading..."} description="Practice this set!">
        <Loading language="en" />
      </AppLayout>
    );

  return (
    <AppLayout
      enLang
      title={`Practice set: "${data.name}"`}
      description="Practice this set!"
    >
      <Dialog
        open={resultDialogOpen}
        onOpenChange={async (open) => {
          if (!open) {
            await router.push(`/english/learn/${setId || ""}`);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <h2>Results!</h2>
          </DialogHeader>

          <div>
            Correct answers: {correctAnswers}/{data.words.length}
          </div>

          <DialogFooter>
            <Button
              onClick={async () =>
                await router.push(`/english/learn/${setId || ""}`)
              }
            >
              Finish practice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div>
        <h2>Your answer</h2>
        <div className="mt-6">
          <form onSubmit={onSubmit}>
            <div className="grid w-full items-center gap-3">
              <Label>Your answer</Label>
              <div className="flex w-full items-center gap-4">
                <Input
                  {...register("answer")}
                  placeholder="Enter a word..."
                  autoFocus
                />
                <Button
                  loading={isCheckingWord}
                  variant={"subtle"}
                  className="flex-shrink-0"
                  type="submit"
                  language="en"
                >
                  Check
                </Button>
              </div>
              <p className="!mt-0 text-sm text-red-500">
                {formErrors.answer?.message ||
                  apiErrors?.data?.zodError?.fieldErrors?.answer?.[0]}
              </p>
            </div>
          </form>
        </div>

        <h2 className="mt-16">Definitions</h2>
        <div className="mt-6 flex flex-col gap-6">
          {data.words[currentIndex]?.meanings.map((meaning) => (
            <div key={meaning.id}>
              <h5 className="font-bold">{meaning.partOfSpeech}</h5>

              <ul className="my-0 flex list-disc flex-col">
                {meaning.definitions.map((definition) => (
                  <li key={definition.id}>{definition.content}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Pracice;
