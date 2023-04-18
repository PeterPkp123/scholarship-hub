import { Copy } from "lucide-react";
import { type NextPage } from "next";
import { z } from "zod";
import AppLayout from "~/components/app-layout";
import Loading from "~/components/loading";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { api } from "~/utils/api";
import { useQueryParams } from "~/utils/use-query-params";
import { truncate } from "../../create";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";

const Index: NextPage = () => {
  const { toast } = useToast();

  const { id: testId } = useQueryParams({ id: z.string() });

  const { data, isLoading, isError } = api.mathCreator.getOneTest.useQuery(
    { id: testId || "" },
    { enabled: !!testId }
  );

  return (
    <AppLayout
      title="Kreator zadań"
      description="Stwórz własy test z matematyki!"
      actions={
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"outline"}
                className="flex items-center gap-2"
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `${window.location.host}/math/creator/test/${
                      testId ?? ""
                    }/test`
                  );

                  toast({
                    title: "Skopiowano link do schowka!",
                    description: "Możesz wysłać go teraz innej osobie.",
                  });
                }}
              >
                Skopiuj link <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Skopiuj link do testu</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      }
    >
      {!data || isLoading || isError ? (
        <Loading />
      ) : (
        <div>
          <h3>Nazwa testu</h3>
          <div className="mt-2 text-gray-600">{data.name}</div>

          <h3>Pytania</h3>
          <div className="mt-2">
            {data.questions.map((question, i) => (
              <Dialog key={question.id}>
                <DialogTrigger asChild>
                  <div className="w-full cursor-pointer rounded-md border border-gray-100 p-4 shadow-md transition-shadow hover:shadow-lg">
                    {i + 1}. {truncate(question.content, 50)}
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <h2>Pytanie {i + 1}.</h2>
                  </DialogHeader>

                  <h3 className="mb-0">Treść</h3>
                  <p className="!my-0">{question.content}</p>

                  {question.graph && (
                    <>
                      <h3 className="mb-0">Wzór wykresu funkcji</h3>
                      <p className="!my-0">{question.graph.infix}</p>
                    </>
                  )}

                  <h3 className="mb-0">Odpowiedź</h3>
                  <p className="!my-0">{question.answers[0]!.content}</p>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default Index;
