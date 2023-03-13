import { type NextPage } from "next";
import AppLayout from "~/components/app-layout";

const Creator: NextPage = () => {
  return (
    <AppLayout
      title="Kreator zadań"
      description="Stwórz własy test z matematyki!"
    >
      Math / creator
    </AppLayout>
  );
};

export default Creator;
