import { zodResolver } from "@hookform/resolvers/zod";
import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AppLayout from "~/components/app-layout";
import Loading from "~/components/loading";
import { type RouterInputs, api } from "~/utils/api";
import { useQueryParams } from "~/utils/use-query-params";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { useToast } from "~/components/ui/toast";
import { Label } from "~/components/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Line } from "react-chartjs-2";
import {
  type ChartData,
  CategoryScale,
  Chart,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "~/components/ui/dialog";
import { useRouter } from "next/router";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

export const checkMathTestAnswerSchema = z.object({
  questionId: z.string(),
  answer: z.string().min(1),
});

const Test: NextPage = () => {
  const router = useRouter();
  const { id: testId } = useQueryParams({ id: z.string() });

  const { toast } = useToast();

  const { data, isLoading, isError } =
    api.mathCreator.getOneTestPractice.useQuery(
      { id: testId || "" },
      { enabled: !!testId }
    );

  const {
    mutateAsync,
    isLoading: isCheckingAnswer,
    error: apiErrors,
  } = api.mathCreator.checkAnswer.useMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors },
  } = useForm<RouterInputs["mathCreator"]["checkAnswer"]>({
    resolver: zodResolver(checkMathTestAnswerSchema),
    defaultValues: {
      questionId: "__QUESTION_ID__",
    },
  });

  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [chartData, setChartData] = useState<
    ChartData<"line", number[], number>
  >({
    labels: [],
    datasets: [],
  });

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < (data?.questions.length ?? 0)) {
      setCurrentQuestionIndex((c) => c + 1);
    } else {
      setResultDialogOpen(true);
    }
  };

  useEffect(() => {
    if (!!data?.questions[currentQuestionIndex]?.graph?.values) {
      const values = data.questions[currentQuestionIndex]!.graph!.values;
      const plotValues = z
        .array(z.object({ x: z.number(), y: z.number() }))
        .safeParse(JSON.parse(values));

      if (!plotValues.success) {
        return;
      }

      setChartData({
        labels: plotValues.data.map((v) => Math.floor(v.x)),
        datasets: [
          {
            label: "f(x)",
            data: plotValues.data.map((v) => v.y),
          },
        ],
      });
    }
  }, [data, currentQuestionIndex]);

  return (
    <AppLayout title="Wykonaj test!" description="Sprawdź się!">
      <Dialog
        open={resultDialogOpen}
        onOpenChange={async (open) => {
          if (!open) {
            await router.push("/math/creator");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <h2>Wyniki!</h2>
          </DialogHeader>

          <div>
            Poprawne odpowiedzi: {correctAnswers}/{data?.questions?.length ?? 0}
          </div>

          <DialogFooter>
            <Button onClick={async () => await router.push("/math/creator")}>
              Koniec testu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!data || isLoading || isError ? (
        <Loading />
      ) : (
        <div>
          <Latex>{data.questions[currentQuestionIndex]?.content}</Latex>

          <form
            className="mt-8"
            onSubmit={handleSubmit(async (formData) => {
              const result = await mutateAsync({
                questionId:
                  data.questions[currentQuestionIndex]?.id ??
                  "__MISSING_QUESTION_ID__",
                answer: formData.answer,
              });

              if (result.correct) {
                setCorrectAnswers((c) => c + 1);
                toast({
                  title: "Dobrze!",
                  description: (
                    <span>
                      Odpowiedź, to faktycznie: <b>{result.correctAnswer}</b>!
                    </span>
                  ),
                });
              } else {
                toast({
                  title: "Źle!",
                  description: (
                    <span>
                      Poprawna odpowiedź, to: <b>{result.correctAnswer}</b>!
                    </span>
                  ),
                });
              }

              reset();
              nextQuestion();
            })}
          >
            <div className="grid w-full items-center gap-3">
              <Label>Twoja odpowiedź</Label>
              <div className="flex w-full items-center gap-4">
                <Input
                  {...register("answer")}
                  placeholder="Wprowadź odpowiedź..."
                  autoFocus
                />
                <Button
                  loading={isCheckingAnswer}
                  variant={"subtle"}
                  className="flex-shrink-0"
                  type="submit"
                >
                  Sprawdź
                </Button>
              </div>
              <p className="!mt-0 text-sm text-red-500">
                {formErrors.answer?.message ||
                  apiErrors?.data?.zodError?.fieldErrors?.answer?.[0]}
              </p>
            </div>
          </form>

          <div>
            {!!data?.questions[currentQuestionIndex]?.graph?.values && (
              <Line
                datasetIdKey="id"
                data={chartData}
                width="100%"
                height="30px"
              />
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default Test;
