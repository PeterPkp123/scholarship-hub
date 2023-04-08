import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AppLayout from "~/components/app-layout";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import { InputWithText } from "~/components/ui/input";
import { RouterInputs, api } from "~/utils/api";

export const truncate = (input: string, len: number) =>
  input.length > len ? `${input.substring(0, len).trimEnd()}...` : input;

type FormValues = RouterInputs["mathCreator"]["createTest"];

export const createMathTestSchema = z.object({
  name: z.string().min(1),
  questions: z.array(
    z.object({
      content: z.string().min(1),
      answer: z.string().min(1),
      graph: z.string().min(1).optional(),
    })
  ),
});

const Create: NextPage = () => {
  const router = useRouter();

  const {
    mutateAsync: addTest,
    isLoading: isAddingTest,
    error: apiErrors,
  } = api.mathCreator.createTest.useMutation();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors: formErrors },
  } = useForm<FormValues>({
    resolver: zodResolver(createMathTestSchema),
    defaultValues: {
      questions: [],
    },
  });

  const [questions, setQuestions] = useState<FormValues["questions"]>([]);

  const [questionContent, setQuestionContent] = useState("");
  const [questionGraph, setQuestionGraph] = useState<string | undefined>(
    undefined
  );
  const [questionAnswer, setQuestionAnswer] = useState("");

  const [addingQuesionOpen, setAddingQuestionOpen] = useState(false);

  return (
    <AppLayout
      title="Kreator zadań - stwórz test"
      description="Stwórz własy test z matematyki!"
    >
      <form
        onSubmit={handleSubmit(async (data) => {
          try {
            await addTest({ ...data, questions });
            await router.push("/math/creator");
          } catch (e) {}
        })}
      >
        <InputWithText
          inputProps={{
            ...register("name"),
            placeholder: "Wpisz nazwę testu...",
          }}
          label="Nazwa testu"
          error={
            formErrors.name?.message ||
            apiErrors?.data?.zodError?.fieldErrors?.name?.[0]
          }
        />

        <div className="my-12">
          <div className="flex w-96 items-center justify-between">
            <h3 className="my-0">Pytania do testu</h3>

            <Dialog
              open={addingQuesionOpen}
              onOpenChange={setAddingQuestionOpen}
            >
              <DialogTrigger asChild>
                <Button variant={"subtle"}>Dodaj pytanie</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <h2>Dodaj pytanie</h2>
                </DialogHeader>

                <InputWithText
                  inputProps={{
                    onChange: (e) => setQuestionContent(e.target.value),
                  }}
                  label="Treść pytania"
                  error={formErrors.questions?.[0]?.content?.message}
                />

                <InputWithText
                  inputProps={{
                    onChange: (e) =>
                      setQuestionGraph(
                        e.target.value !== "" ? e.target.value : undefined
                      ),
                  }}
                  label="Wzór funkcji wykresu do pytania (opcjonalnie)"
                  error={formErrors.questions?.[0]?.graph?.message}
                />

                <InputWithText
                  inputProps={{
                    onChange: (e) => setQuestionAnswer(e.target.value),
                  }}
                  label="Poprawna odpowiedź"
                  error={formErrors.questions?.[0]?.answer?.message}
                />

                <Button
                  type="button"
                  variant={"subtle"}
                  className="w-96"
                  onClick={() => {
                    clearErrors();

                    if (!questionContent) {
                      setError("questions.0.content", {
                        message: "Musisz uzupełnić treść pytania!",
                      });
                    }

                    if (!questionAnswer) {
                      setError("questions.0.answer", {
                        message: "Musisz uzupełnić odpowiedź na pytanie!",
                      });
                    }

                    if (!questionContent || !questionAnswer) return;

                    setQuestions((q) => [
                      ...q,
                      {
                        answer: questionAnswer,
                        content: questionContent,
                        graph: questionGraph,
                      },
                    ]);

                    setQuestionAnswer("");
                    setQuestionContent("");
                    setQuestionGraph(undefined);
                    clearErrors();

                    setAddingQuestionOpen(false);
                  }}
                >
                  Dodaj pytanie
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-6 flex w-96 flex-col gap-2">
            {questions.length > 0 ? (
              questions.map((question) => (
                <div
                  key={question.answer + question.content}
                  className="flex w-full items-center justify-between gap-4 rounded-md border border-gray-100 p-4 shadow-md"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-lg">
                      {truncate(question.content, 50)}
                    </span>
                    {question.graph && (
                      <span className="text-sm text-gray-400">
                        {question.graph}
                      </span>
                    )}
                    <span className="text-sm text-gray-600">
                      Odpowiedź: {question.answer}
                    </span>
                  </div>

                  <div>
                    <Button variant={"outline"}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <span>Dodaj swoje pierwsze pytanie!</span>
            )}
          </div>
        </div>

        <Button type="submit" className="w-96" loading={isAddingTest}>
          Stwórz test
        </Button>
      </form>
    </AppLayout>
  );
};

export default Create;
