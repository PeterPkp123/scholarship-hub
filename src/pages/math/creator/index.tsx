import { Trash2 } from "lucide-react";
import { type NextPage } from "next";
import Link from "next/link";
import AppLayout from "~/components/app-layout";
import Loading from "~/components/loading";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

const Index: NextPage = () => {
  const { data, isLoading, isError, refetch } =
    api.mathCreator.getAllTests.useQuery();

  const { mutateAsync } = api.mathCreator.deleteTest.useMutation();

  return (
    <AppLayout
      title="Kreator zadań"
      description="Stwórz własy test z matematyki!"
      actions={
        <Link href={"/math/creator/create"}>
          <Button>Stwórz test</Button>
        </Link>
      }
    >
      <div>
        {!data || isLoading || isError ? (
          <Loading />
        ) : (
          <div className="flex flex-col gap-4">
            {(data?.length ?? 0) !== 0 ? (
              data.map((test) => (
                <div
                  key={test.id}
                  className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-gray-200 p-4 shadow-md transition-shadow hover:shadow-lg"
                >
                  <Link href={`/math/creator/test/${test.id}`}>
                    <div>
                      <h3 className="my-0">{test.name}</h3>
                      <span>
                        <b>{test._count.questions}</b> pytanie / pytań / pytania
                      </span>
                    </div>
                  </Link>
                  <div>
                    <Button
                      className="h-12 w-12"
                      variant={"outline"}
                      onClick={async () => {
                        try {
                          await mutateAsync({ id: test.id });
                          await refetch();
                        } catch (e) {}
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-lg">Nie dodano żadnych testów!</span>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Index;
