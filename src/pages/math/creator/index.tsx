import { type NextPage } from "next";
import Link from "next/link";
import AppLayout from "~/components/app-layout";
import { Button } from "~/components/ui/button";

const Index: NextPage = () => {
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
      Math / creator
    </AppLayout>
  );
};

export default Index;
