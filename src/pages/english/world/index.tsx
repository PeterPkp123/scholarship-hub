import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import AppLayout from "~/components/app-layout";
import Singapore from "~/components/countries/singapore";
import Australia from "~/components/countries/australia";
import Canada from "~/components/countries/canada";
import Ireland from "~/components/countries/ireland";
import India from "~/components/countries/india";
import NewZealand from "~/components/countries/new-zealand";
import UnitedKingdom from "~/components/countries/united-kingdom";
import UnitedStates from "~/components/countries/united-states";
import SouthAfrica from "~/components/countries/south-africa";
import Philippines from "~/components/countries/philippines";

export type CountryCode =
  | "au"
  | "ca"
  | "ie"
  | "in"
  | "nz"
  | "uk"
  | "us"
  | "za"
  | "ph"
  | "sg";

export type Country = {
  code: CountryCode;
  name: string;
  description: string;
  content: React.ReactNode;
};

export const COUNTRIES: Country[] = [
  {
    code: "sg",
    name: "Singapore",
    description:
      "Singapore is a fascinating country with a diverse culture and a thriving economy. English is one of the official languages of Singapore, along with Chinese, Malay, and Tamil.",
    content: <Singapore />,
  },
  {
    code: "au",
    name: "Australia",
    description:
      "Australia is a fascinating country with unique wildlife, stunning beaches, and a laid-back culture. English is the official language of Australia, and it's widely spoken throughout the country.",
    content: <Australia />,
  },
  {
    code: "ca",
    name: "Canada",
    description:
      "Canada is a vast and beautiful country with stunning natural scenery and a thriving economy. English is one of the two official languages of Canada (the other is French), and it's widely spoken throughout the country.",
    content: <Canada />,
  },
  {
    code: "ie",
    name: "Ireland",
    description:
      "Ireland is a beautiful country with a rich history and culture. English is the official language of Ireland, although Irish Gaelic is also spoken here.",
    content: <Ireland />,
  },
  {
    code: "in",
    name: "India",
    description:
      "India is a vast and diverse country with a rich history and culture. English is widely spoken throughout India, and it's one of the official languages of the country.",
    content: <India />,
  },
  {
    code: "nz",
    name: "New Zealand",
    description:
      "New Zealand is a small island country with stunning natural beauty and a unique culture. English is the official language of New Zealand, and it's widely spoken throughout the country.",
    content: <NewZealand />,
  },
  {
    code: "uk",
    name: "United Kingdom",
    description:
      "The UK is a fascinating country with a rich history and culture. It's home to some of the world's most famous landmarks, including Stonehenge and Big Ben. English is the official language of the UK.",
    content: <UnitedKingdom />,
  },
  {
    code: "us",
    name: "United States",
    description:
      "The USA is one of the most fascinating countries in the world. It's home to diverse landscapes, cultures, and people, and has a rich history and vibrant economy. English is the official language of the United States, although many other languages are spoken here too.",
    content: <UnitedStates />,
  },
  {
    code: "za",
    name: "South Africa",
    description:
      "South Africa is a country with a fascinating history and diverse culture. English is one of the official languages of South Africa, along with Afrikaans, Zulu, and Xhosa.",
    content: <SouthAfrica />,
  },
  {
    code: "ph",
    name: "Philippines",
    description:
      "The Philippines is a beautiful country with stunning natural scenery and a rich culture. English is widely spoken throughout the Philippines and is one of the official languages of the country.",
    content: <Philippines />,
  },
];

const Index: NextPage = () => {
  return (
    <AppLayout
      enLang
      title="English world"
      description="Explore the english world!"
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {COUNTRIES.map((country) => (
          <Link
            key={country.code}
            href={`/english/world/${country.code}`}
            className="flex w-full cursor-pointer items-center gap-8 rounded-md border border-gray-200 transition-shadow hover:shadow-md"
          >
            <div className="flex h-32 w-32 items-center justify-center bg-gray-200">
              <Image
                alt=""
                src={`/flags/${country.code}.svg`}
                width={70}
                height={70}
              />
            </div>

            <h3 className="my-0 text-lg md:text-2xl">{country.name}</h3>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
};

export default Index;
