import { NextPage } from "next";
import AppLayout from "~/components/app-layout";

const Learn: NextPage = () => {
  return (
    <AppLayout
      title="Vocabulary builder"
      description="Learn english vocabulary with ease!"
    >
      English / learn
    </AppLayout>
  );
};

export default Learn;
