import { zodResolver } from "@hookform/resolvers/zod";
import { NextPage } from "next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AppLayout from "~/components/app-layout";
import Loading from "~/components/loading";
import { RouterInputs, api } from "~/utils/api";
import { useQueryParams } from "~/utils/use-query-params";

export const checkMathTestAnswerSchema = z.object({
  questionId: z.string(),
  answer: z.string(),
});

const Test: NextPage = () => {
  const { id: testId } = useQueryParams({ id: z.string() });

  const { data, isLoading, isError, refetch } =
    api.mathCreator.getOneTestPractice.useQuery(
      { id: testId || "" },
      { enabled: !!testId }
    );

  const { mutateAsync, isLoading: isCheckingAnswer } =
    api.mathCreator.checkAnswer.useMutation();

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

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  return (
    <AppLayout title="Wykonaj test!" description="Sprawdź się!">
      {!data || isLoading || isError ? (
        <Loading />
      ) : (
        <div>{data.questions[currentQuestionIndex]?.content}</div>
      )}
    </AppLayout>
  );
};

export default Test;
