import React, { type PropsWithChildren } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/router";

const AppLayout: React.FC<
  PropsWithChildren<{
    title: string;
    description: string;
    enLang?: boolean;
    actions?: React.ReactNode;
  }>
> = ({ children, title, description, actions, enLang = false }) => {
  const router = useRouter();

  return (
    <div className="mx-6 my-12 sm:mx-12 sm:my-24 lg:mx-24 lg:my-48">
      <div>
        <Button
          variant={"link"}
          className="px-0 text-gray-500"
          onClick={() => router.back()}
        >
          <span className="flex items-center gap-2 transition-colors hover:text-gray-800">
            <ArrowLeft size={16} />
            {enLang ? "Go back" : "Powrót"}
          </span>
        </Button>
        <div className="flex w-full flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h1 className="mt-8">{title}</h1>
            <p>{description}</p>
          </div>
          <div className="flex items-center gap-2">{actions}</div>
        </div>
      </div>

      <div className="mt-20">{children}</div>
    </div>
  );
};

export default AppLayout;
