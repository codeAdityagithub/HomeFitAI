import useDashboardLayoutData from "@/hooks/useDashboardLayout";
import ResponsiveDialog from "../custom/ResponsiveDialog";
import EditCaloriesForm from "./EditCaloriesForm";
import EditLogForm from "./EditLogForm";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

function ExerciseAddTable() {
  const { log } = useDashboardLayoutData();
  return (
    <ResponsiveDialog
      title={"Add Exercise Manually"}
      description={`Its recommended to track exercises for much better accuracy.`}
      trigger={
        <Button
          size="icon"
          className="min-w-9 h-9"
        >
          <Plus />
        </Button>
      }
    >
      <EditCaloriesForm logId={log.id} />
    </ResponsiveDialog>
  );
}
export default ExerciseAddTable;
