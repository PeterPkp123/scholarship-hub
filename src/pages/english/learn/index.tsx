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

export const createVocabSetSchema = z.object({ name: z.string().min(1) });

const Index: NextPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading, isError, refetch } =
    api.englishLearn.getSets.useQuery();

  const {
    mutateAsync,
    isLoading: isAddingSet,
    error: apiErrors,
  } = api.englishLearn.createSet.useMutation({
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
      await mutateAsync({ ...data });
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
          {data.map((set) => (
            <Link
              href={`/english/learn/${set.id}`}
              className="cursor-pointer rounded-md border border-gray-200 p-6 shadow-md transition-shadow hover:shadow-xl"
              key={set.id}
            >
              <h3 className="!my-0">{set.name}</h3>
              <p className="!mt-1 !mb-0 text-gray-500">
                {set._count.words} word(s) in this set
              </p>
            </Link>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default Index;
