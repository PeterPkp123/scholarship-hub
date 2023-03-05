import Link from "next/link";
import { PropsWithChildren } from "react";
import { ArrowLeft } from "lucide-react";

const AppLayout: React.FC<
  PropsWithChildren<{ title: string; description: string; enLang?: boolean }>
> = ({ children, title, description, enLang = false }) => {
  return (
    <div className="mx-6 my-12 sm:mx-12 sm:my-24 lg:mx-24 lg:my-48">
      <div>
        <Link className="text-gray-500" href={"/"}>
          <span className="flex items-center gap-2 transition-colors hover:text-gray-800">
            <ArrowLeft size={16} />
            {enLang ? "Back to apps" : "Powrót do aplikacji"}
          </span>
        </Link>
        <h1 className="mt-8">{title}</h1>
        <p>{description}</p>
      </div>

      <div className="mt-20">{children}</div>
    </div>
  );
};

export default AppLayout;
