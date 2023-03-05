import { type NextPage } from "next";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/utils/cn";
import { Github } from "lucide-react";

const ProjectPreview: React.FC<{
  name: string;
  subject: "Matematyka" | "English";
  description: string;
  to: string;
}> = ({ name, subject, description, to }) => {
  return (
    <div className="w-full cursor-pointer rounded-md border-2 border-gray-100 bg-gray-100 p-8 transition-colors hover:bg-white">
      <span
        className={cn(
          "rounded-md px-2 py-1 text-sm uppercase tracking-widest text-white",
          subject === "Matematyka" && "bg-pink-600",
          subject === "English" && "bg-blue-600"
        )}
      >
        {subject}
      </span>
      <h2 className="mt-6">{name}</h2>
      <p>{description}</p>
      <Link href={to}>
        <Button className="mt-8">
          {subject !== "English" ? "Przejdź" : "Enter"}
        </Button>
      </Link>
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <div className="mx-6 my-12 sm:mx-12 sm:my-24 lg:mx-24 lg:my-48">
      <div>
        <h1>Scholarship Hub</h1>
        <p>
          Aplikacja wykonana w ramach projektu &quot;Śląskie. Inwestujemy w
          talenty&quot;.
        </p>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-2">
        <ProjectPreview
          name="Kreator zadań"
          subject="Matematyka"
          description="Stwórz własny test z matematyki!"
          to="/math/creator"
        />

        <ProjectPreview
          name="Analiza funkcji"
          subject="Matematyka"
          description="Wprowadź wzór funkcji i obliczaj wyniki!"
          to="/math/analyzer"
        />

        <ProjectPreview
          name="English world"
          subject="English"
          description="Explore the english world!"
          to="/english/world"
        />

        <ProjectPreview
          name="Vocabulary builder"
          subject="English"
          description="Learn english vocabulary with ease!"
          to="/english/learn"
        />
      </div>

      <footer className="mt-32 flex h-5 items-center gap-4 text-gray-400">
        <span>Piotr Pilszczek</span>
        <Separator orientation="vertical" />
        <Link
          href={"https://github.com/PeterPkp123/scholarship-hub"}
          className="flex items-center gap-2 transition-colors hover:text-gray-600"
        >
          <Github size={16} />
          <span>GitHub</span>
        </Link>
      </footer>
    </div>
  );
};

export default Home;
