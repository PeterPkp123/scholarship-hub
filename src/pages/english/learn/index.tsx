import { type NextPage } from "next";
import { z } from "zod";
import AppLayout from "~/components/app-layout";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api, type RouterInputs } from "~/utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputWithText } from "~/components/ui/input";
import { useState } from "react";
import Loading from "~/components/loading";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Trash2 } from "lucide-react";

export const createVocabSetSchema = z.object({ name: z.string().min(1) });

const Index: NextPage = () => {
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading, isError, refetch } =
    api.englishLearn.getSets.useQuery();

  const {
    mutateAsync: addSet,
    isLoading: isAddingSet,
    error: apiErrors,
  } = api.englishLearn.createSet.useMutation({
    onSuccess: async () => await refetch(),
  });

  const { mutateAsync: deleteSet, isLoading: isDeletingSet } =
    api.englishLearn.deleteSet.useMutation({
      onSuccess: async () => await refetch(),
    });

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<RouterInputs["englishLearn"]["createSet"]>({
    resolver: zodResolver(createVocabSetSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await addSet({ ...data });
      setDialogOpen(false);
    } catch (e) {}
  });

  return (
    <AppLayout
      enLang
      title="Vocabulary builder"
      description="Learn English vocabulary with ease!"
      actions={
        <>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setDialogOpen(true)}>
                Create new set
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new set</DialogTitle>
                <DialogDescription>
                  Fill in the form below to create a new vocabulary set.
                </DialogDescription>
              </DialogHeader>
              <div>
                <form onSubmit={onSubmit}>
                  <InputWithText
                    inputProps={{
                      ...register("name"),
                      placeholder: "Name of the set...",
                    }}
                    label="Name of the set"
                    error={
                      formErrors.name?.message ||
                      apiErrors?.data?.zodError?.fieldErrors?.name?.[0]
                    }
                  />

                  <DialogFooter>
                    <Button loading={isAddingSet} type="submit">
                      Create new set
                    </Button>
                  </DialogFooter>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </>
      }
    >
      {isLoading || isError ? (
        <Loading language="en" />
      ) : (
        <div className="flex flex-col gap-4">
          {data.length > 0 ? (
            data.map((set) => (
              <div
                key={set.id}
                className="flex cursor-pointer items-center gap-4 rounded-md border border-gray-200 p-6 shadow-md transition-shadow hover:shadow-xl"
              >
                <Link href={`/english/learn/${set.id}`} className="w-full">
                  <h3 className="!my-0">{set.name}</h3>
                  <p className="!mt-1 !mb-0 text-gray-500">
                    {set._count.words} word(s) in this set
                  </p>
                </Link>

                <div>
                  <AlertDialog
                    open={alertDialogOpen}
                    onOpenChange={setAlertDialogOpen}
                  >
                    <div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              className="h-12 w-12"
                              variant={"outline"}
                              onClick={() => setAlertDialogOpen(true)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete this set</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. You&apos;ll have to add
                          this set again.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                          language="en"
                          loading={isDeletingSet}
                          onClick={async () => {
                            try {
                              await deleteSet({
                                setId: set.id,
                              });

                              setAlertDialogOpen(false);
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
            <div className="text-xl">
              Click the button above to add a new set!
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
};

export default Index;
