import { zodResolver } from "@hookform/resolvers/zod";
import { type NextPage } from "next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AppLayout from "~/components/app-layout";
import { Label } from "~/components/label";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api, RouterInputs } from "~/utils/api";

export const processEquationSchema = z.object({ equation: z.string().min(1) });

const Analyzer: NextPage = () => {
  const {
    mutateAsync,
    isLoading: isProcessingEquation,
    error: apiErorrs,
  } = api.mathAnalyzer.processEquation.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<RouterInputs["mathAnalyzer"]["processEquation"]>({
    resolver: zodResolver(processEquationSchema),
  });

  return (
    <AppLayout
      title="Analiza funkcji"
      description="Wprowadź wzór funkcji i obliczaj wyniki!"
    >
      <form
        onSubmit={handleSubmit(async (data) => {
          try {
            const result = await mutateAsync(data);
            console.log(result);
          } catch (e) {}
        })}
      >
        <div className="grid w-full items-center gap-3">
          <Label>Równanie funkcji</Label>
          <div className="flex w-full items-center gap-4">
            <Input
              {...register("equation")}
              placeholder="Wprowadź równanie..."
              autoFocus
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
    </AppLayout>
  );
};

export default Analyzer;
