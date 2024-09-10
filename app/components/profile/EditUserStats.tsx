import useMediaQuery from "@/hooks/useMediaQuery";
import { Stats } from "@prisma/client";
import ResponsiveDialog from "../custom/ResponsiveDialog";

const EditUserStats = ({ stat }: { stat: "age" | "height" | "goalWeight" }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  console.log(isMobile);
  return (
    <ResponsiveDialog
      title="Edit Form"
      description="Description"
      triggerText="Button"
    >
      <p>Hello</p>
    </ResponsiveDialog>
  );
};
export default EditUserStats;
