import { type NextPage } from "next";
import { useRouter } from "next/router";
import AppLayout from "~/components/app-layout";
import { COUNTRIES, type Country, type CountryCode } from "..";
import Image from "next/image";

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
      <h3>Country outline & flag</h3>
      <div className="mt-4 flex h-96 w-96 items-center justify-center rounded-md border border-gray-200 bg-gray-100">
        <Image
          alt=""
          src={`/flags/${country.code}.svg`}
          width={230}
          height={230}
        />
      </div>

      <h3 className="mt-20">Details</h3>
      <div className="mt-4">{country.content}</div>
    </AppLayout>
  );
};

export default Index;
