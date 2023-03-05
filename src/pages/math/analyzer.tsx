import { NextPage } from "next";
import AppLayout from "~/components/app-layout";

const Analyzer: NextPage = () => {
  return (
    <AppLayout
      title="Analiza funkcji"
      description="Wprowadź wzór funkcji i obliczaj wyniki!"
    >
      Math / analyzer
    </AppLayout>
  );
};

export default Analyzer;
