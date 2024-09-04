import { DashboardExercise } from "@/routes/dashboard+/workout+";
import { groupBy } from "@/utils/general";
import { useMemo, useState } from "react";

const useExercises = (exercises: DashboardExercise[]) => {
  // All non changing parts
  const exercisesByTarget = useMemo(
    () => groupBy(exercises, "target"),
    [exercises]
  );
  const exercisesByEquipment = useMemo(
    () => groupBy(exercises, "equipment"),
    [exercises]
  );
  const bandGrouped = useMemo(
    () => groupBy(exercisesByEquipment["band"], "target"),
    [exercisesByEquipment]
  );
  const dumbbellGrouped = useMemo(
    () => groupBy(exercisesByEquipment["dumbbell"], "target"),
    [exercisesByEquipment]
  );

  // handling how many rows are visible
  const [bandRows, setBandRows] = useState(2);
  const [dumbRows, setDumbRows] = useState(2);

  function toggleBands() {
    setBandRows(bandRows === 2 ? Object.keys(bandGrouped).length : 2);
  }
  function toggleDumbbell() {
    setDumbRows(dumbRows === 2 ? Object.keys(dumbbellGrouped).length : 2);
  }
  return {
    exercisesByTarget,
    exercisesByEquipment,
    bandGrouped,
    dumbbellGrouped,
    toggleBands,
    toggleDumbbell,
    bandRows,
    dumbRows,
  };
};
export default useExercises;
