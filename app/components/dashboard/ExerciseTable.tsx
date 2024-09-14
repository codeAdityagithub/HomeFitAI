import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { capitalizeEachWord, convertMinutesToText } from "@/utils/general";
import { ExerciseLog } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";

function ExerciseTable({
  exercises,
}: {
  exercises: SerializeFrom<ExerciseLog>[];
}) {
  return (
    <Table>
      <TableCaption>List of exercises you performed today</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">Name</TableHead>
          <TableHead>Sets</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead className="">Calories</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exercises.map((e) => (
          <TableRow key={e.name + "table"}>
            <TableCell className="font-medium">
              {capitalizeEachWord(e.name)}
            </TableCell>
            <TableCell className="">{e.sets.length}</TableCell>
            <TableCell>{convertMinutesToText(e.duration)}</TableCell>
            <TableCell className="">{e.calories} Kcal</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
export default ExerciseTable;
