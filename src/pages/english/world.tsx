import { NextPage } from "next";
import AppLayout from "~/components/app-layout";

const World: NextPage = () => {
  return (
    <AppLayout
      enLang
      title="English world"
      description="Explore the english world!"
    >
      English / world
    </AppLayout>
  );
};

export default World;
