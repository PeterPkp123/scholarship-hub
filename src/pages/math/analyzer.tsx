import { zodResolver } from "@hookform/resolvers/zod";
import { type NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AppLayout from "~/components/app-layout";
import { Label } from "~/components/label";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api, type RouterInputs } from "~/utils/api";
import { Line } from "react-chartjs-2";
import {
  ChartData,
  CategoryScale,
  Chart,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

export const processEquationSchema = z.object({
  equation: z.string().min(1),
  variableValue: z.number().optional(),
});

const Analyzer: NextPage = () => {
  const {
    mutateAsync,
    isLoading: isProcessingEquation,
    error: apiErorrs,
  } = api.mathAnalyzer.processEquation.useMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors: formErrors },
  } = useForm<RouterInputs["mathAnalyzer"]["processEquation"]>({
    resolver: zodResolver(processEquationSchema),
  });

  const [showValueResult, setShowValueResult] = useState(false);
  const [reversedPolishNotation, setReversedPolishNotation] = useState("");
  const [valueResult, setValueResult] = useState<number | null>(null);
  const [chartData, setChartData] = useState<
    ChartData<"line", number[], number>
  >({
    labels: [],
    datasets: [],
  });

  const variableValue = watch("variableValue");

  useEffect(() => {
    setShowValueResult(
      variableValue !== undefined && !isNaN(Number(variableValue))
    );
  }, [variableValue]);

  return (
    <AppLayout
      title="Analiza funkcji"
      description="Wprowadź wzór funkcji i obliczaj wyniki!"
    >
      <form
        onSubmit={handleSubmit(async (data) => {
          try {
            const result = await mutateAsync(data);

            setReversedPolishNotation(result.reversedPolishNotation.join(" "));
            setValueResult(result.valueResult);

            setChartData({
              labels: result.plotValues.map((v) => v.x),
              datasets: [
                {
                  label: "f(x)",
                  data: result.plotValues.map((v) => v.y),
                },
              ],
            });
          } catch (e) {}
        })}
      >
        <div className="grid w-full items-center gap-3">
          <Label>Równanie funkcji</Label>
          <div className="flex w-full items-center gap-4">
            <span className="min-w-fit">f(x) =</span>
            <Input
              {...register("equation")}
              placeholder="Wprowadź równanie..."
              autoFocus
            />
            <Input
              {...register("variableValue", {
                valueAsNumber: true,
              })}
              type="number"
              defaultValue={0}
              className="w-24"
              placeholder="x = ?"
            />
            <Button
              loading={isProcessingEquation}
              variant={"subtle"}
              className="flex-shrink-0"
              type="submit"
            >
              Przelicz
            </Button>
          </div>
          <p className="!mt-0 text-sm text-red-500">
            {formErrors.equation?.message ||
              apiErorrs?.data?.zodError?.fieldErrors?.equation?.[0]}
          </p>
        </div>
      </form>

      {showValueResult && valueResult !== null && (
        <div className="mt-12 text-2xl">
          Wynik: {valueResult.toFixed(2).replace(/[.,]00$/, "")}
        </div>
      )}

      <div className="mt-12 text-2xl">
        RPN:{" "}
        {reversedPolishNotation ? (
          <span className="font-mono font-bold">{reversedPolishNotation}</span>
        ) : (
          <span className="text-gray-500">czekam na wzór...</span>
        )}
      </div>

      <div className="mt-12">
        <Line datasetIdKey="id" data={chartData} />
      </div>
    </AppLayout>
  );
};

export default Analyzer;
