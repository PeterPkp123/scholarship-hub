import { type NextPage } from "next";
import { useRouter } from "next/router";
import AppLayout from "~/components/app-layout";
import { COUNTRIES, Country, CountryCode } from "..";

const useCountry = (): Country => {
  const router = useRouter();
  const { country } = router.query;

  return (
    COUNTRIES.find((c) => c.code === country) ?? {
      name: "Country not found",
      code: "__NOT_FOUND__" as CountryCode,
      description: "",
      content: <></>,
    }
  );
};

const Index: NextPage = () => {
  const country = useCountry();

  return (
    <AppLayout title={country.name} description={country.description} enLang>
      {country.content}
    </AppLayout>
  );
};

export default Index;
