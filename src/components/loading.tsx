import { Loader2 } from "lucide-react";

const Loading: React.FC<{ language?: "pl" | "en" }> = ({ language = "pl" }) => {
  return (
    <span className="flex items-center gap-2 text-gray-500">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {language === "pl" ? "Ładowanie..." : "Loading..."}
    </span>
  );
};

export default Loading;
