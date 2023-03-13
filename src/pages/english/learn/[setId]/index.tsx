import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AppLayout from "~/components/app-layout";
import { Label } from "~/components/label";
import Loading from "~/components/loading";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { api, type RouterInputs } from "~/utils/api";
import { useQueryParams } from "~/utils/use-query-params";
import { Volume2, Trash2 } from "lucide-react";
import { useAudioPlayer } from "~/utils/use-audio-player";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

export const addWordSchema = z.object({
  setId: z.string().min(1),
  word: z.string().min(1),
});

const Index: NextPage = () => {
  const router = useRouter();
  const { setId } = useQueryParams({ setId: z.string() });

  const { data, isLoading, isError, refetch } =
    api.englishLearn.getSet.useQuery(
      { setId: setId || "" },
      { enabled: !!setId }
    );

  const { mutateAsync: deleteWord, isLoading: isDeletingWord } =
    api.englishLearn.removeWord.useMutation({
      onSuccess: async () => await refetch(),
    });

  const {
    mutateAsync: addWord,
    isLoading: isAddingWord,
    error: apiErrors,
  } = api.englishLearn.addWord.useMutation({
    onSuccess: async () => await refetch(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    reset,
  } = useForm<RouterInputs["englishLearn"]["addWord"]>({
    resolver: zodResolver(addWordSchema),
    defaultValues: { setId: setId || "__SET_ID__" },
  });

  const { play } = useAudioPlayer();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await addWord({ ...data, setId: setId || "" });
      reset();
    } catch (e) {}
  });

  if (!data || isLoading || isError)
    return (
      <AppLayout
        enLang
        title={"Loading..."}
        description="Learn words in this set!"
      >
        <Loading language="en" />
      </AppLayout>
    );

  return (
    <AppLayout
      enLang
      title={data.name}
      description="Learn words in this set!"
      actions={
        <>
          {data.words.length > 0 ? (
            <Button
              onClick={async () => {
                await router.push(`/english/learn/${setId || ""}/practice`);
              }}
            >
              Practice set
            </Button>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button disabled>Practice set</Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  You can&apos;t practice a set without any words.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </>
      }
    >
      <div>
        <h2>Add a word</h2>
        <form className="mt-4 flex items-center gap-4" onSubmit={onSubmit}>
          <div className="grid w-full items-center gap-3">
            <Label>Word</Label>
            <div className="flex w-full items-center gap-4">
              <Input {...register("word")} placeholder="Enter a word..." />
              <Button
                loading={isAddingWord}
                variant={"subtle"}
                className="flex-shrink-0"
                type="submit"
                language="en"
              >
                Add word
              </Button>
            </div>
            <p className="!mt-0 text-sm text-red-500">
              {formErrors.word?.message ||
                apiErrors?.data?.zodError?.fieldErrors?.word?.[0]}
            </p>
          </div>
        </form>

        <h2 className="mt-16">List of the words</h2>
        <div className="mt-4 flex flex-col gap-4">
          {data.words.length > 0 ? (
            data.words.map((word) => (
              <div
                key={word.id}
                className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-md p-4 shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="w-full">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="flex w-full flex-col items-start outline-none">
                        <h4 className="my-0">{word.content}</h4>

                        <div className="flex flex-wrap items-center gap-x-3">
                          {word.phonetics.map((phonetic) => (
                            <span className="text-gray-500" key={phonetic.id}>
                              {phonetic.content}
                            </span>
                          ))}
                        </div>
                      </button>
                    </DialogTrigger>
                    <DialogContent big>
                      <DialogHeader>
                        <h2 className="!my-0">{word.content}</h2>
                      </DialogHeader>

                      <h4>Phonetics</h4>
                      <div className="flex flex-wrap items-center gap-x-3">
                        {word.phonetics.map((phonetic) => (
                          <span className="text-gray-500" key={phonetic.id}>
                            {phonetic.content}
                          </span>
                        ))}
                      </div>
                      {word.phonetics.find((p) => !!p.audioUrl) && (
                        <span
                          className="flex cursor-pointer items-center gap-2 transition-colors hover:text-gray-600"
                          onClick={async () => {
                            await play(
                              word.phonetics.find((p) => !!p.audioUrl)
                                ?.audioUrl ?? ""
                            );
                          }}
                        >
                          <Volume2 className="h-5 w-5 flex-shrink-0" />
                          Listen to the recording
                        </span>
                      )}

                      <h4>Definitions</h4>
                      <ScrollArea className="max-h-[50vh] w-full rounded-md border p-4">
                        <div className="flex flex-col gap-6">
                          {word.meanings.map((meaning) => (
                            <div key={meaning.id}>
                              <h5 className="font-bold">
                                {meaning.partOfSpeech}
                              </h5>

                              <ul className="my-0 flex list-disc flex-col">
                                {meaning.definitions.map((definition) => (
                                  <li key={definition.id}>
                                    {definition.content}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>
                <div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button className="h-12 w-12" variant={"outline"}>
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete this word</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. You&apos;ll have to add
                          this word again.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                          language="en"
                          loading={isDeletingWord}
                          onClick={async () => {
                            try {
                              await deleteWord({
                                setId: setId || "",
                                wordId: word.id,
                              });
                            } catch (e) {}
                          }}
                        >
                          Delete
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          ) : (
            <div className="text-xl">Add new words to this set!</div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
