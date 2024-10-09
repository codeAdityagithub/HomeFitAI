import { capitalizeEachWord } from "@/utils/general";
import GoBack from "../GoBack";

const DetectionHeader = ({ title }: { title: string }) => {
  return (
    <div className="flex gap-2 items-center mb-4">
      <GoBack />
      <h1 className="text-2xl font-bold text-muted-foreground underline underline-offset-4">
        {capitalizeEachWord(title)}
      </h1>
    </div>
  );
};
export default DetectionHeader;
