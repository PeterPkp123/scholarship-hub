import { NextPage } from "next";
import { z } from "zod";
import AppLayout from "~/components/app-layout";
import { api } from "~/utils/api";
import { useQueryParams } from "~/utils/use-query-params";

const Test: NextPage = () => {
  const { id: testId } = useQueryParams({ id: z.string() });

  const { data, isLoading, isError, refetch } =
    api.mathCreator.getOneTest.useQuery(
      { id: testId || "" },
      { enabled: !!testId }
    );

  return (
    <AppLayout title="Wykonaj test!" description="Sprawdź się!">
      {testId}
    </AppLayout>
  );
};

export default Test;
