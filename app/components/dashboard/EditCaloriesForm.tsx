import { useEffect, useState } from "react";
import { Input } from "../ui/input";

type Exercises = { name: string; met: number; imageUrl: string }[];
const EditCaloriesForm = ({ logId }: { logId: string }) => {
  const [exercises, setExercises] = useState<Exercises>([]);

  useEffect(() => {
    const abortController = new AbortController();

    fetch(`/api/exercises`, { signal: abortController.signal })
      .then((res) => res.json())
      .then((data) => setExercises(data.exercises));

    return () => {
      abortController.abort();
    };
  }, [logId]);

  return (
    <div className="p-4 pb-0">
      <Input placeholder="Search an exercise..." />
      <div className=""></div>
    </div>
  );
};
export default EditCaloriesForm;
