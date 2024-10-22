import { type ExerciseId } from "@/utils/exercises/types";
import { importFunction } from "@/utils/tensorflow/imports";
import { useEffect, useState } from "react";

const useDynamicExerciseFunction = (id: ExerciseId) => {
  const [func, setFunc] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const funcName = id;
    async function loadFunction() {
      setLoading(true);
      const fetchedFunction = await importFunction(funcName);

      setLoading(false);
      setFunc(() => fetchedFunction);
    }
    loadFunction();
  }, [id]);

  return {
    func,
    loading,
  } as const;
};
export default useDynamicExerciseFunction;
