import useDashboardLayoutData from "@/hooks/useDashboardLayout";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import EditCaloriesForm from "./EditCaloriesForm";

function ExerciseAddTable() {
  const { log } = useDashboardLayoutData();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="min-w-9 h-9"
        >
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Exercise Manually</DialogTitle>
          <DialogDescription>
            Its recommended to track exercises for much better accuracy.
          </DialogDescription>
        </DialogHeader>
        <EditCaloriesForm logId={log.id} />
      </DialogContent>
    </Dialog>
  );
}
export default ExerciseAddTable;
