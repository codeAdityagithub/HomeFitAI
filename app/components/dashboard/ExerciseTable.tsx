import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { splitRepsIntoTwo } from "@/lib/utils";
import { capitalizeEachWord, convertMinutesToText } from "@/utils/general";
import { ExerciseLog } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { Info, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import ExerciseAddTable from "./ExerciseAddTable";

function ExerciseTable({
  exercises,
}: {
  exercises: SerializeFrom<ExerciseLog>[];
}) {
  const [input, setInput] = useState("");
  const filteredExercises = useMemo(() => {
    const inp = input.toLowerCase();
    return exercises.filter((e) => e.name.includes(inp));
  }, [input, exercises]);
  const getTextFromReps = (reps: number) => {
    const { left, right } = splitRepsIntoTwo(reps);
    if (right) {
      return `L: ${left}, R: ${right}`;
    }
    return left;
  };
  return (
    <Card className="flex flex-col gap-2 bg-secondary/50">
      <CardHeader className="flex flex-row flex-wrap gap-2 items-center justify-between pb-2">
        <CardTitle className="border-l-4 border-accent text-left pl-4">
          Today's Exercise Statistics
        </CardTitle>
        <div className="relative flex items-center gap-4">
          <Input
            placeholder="Search Exercises..."
            value={input}
            className="pl-10"
            onChange={(e) => setInput(e.target.value)}
            id="searchInput"
          />
          <Label htmlFor="searchInput">
            <Search className="absolute left-2 top-0 h-full text-muted-foreground" />
          </Label>
          <ExerciseAddTable />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
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
            {filteredExercises.map((e) => (
              <TableRow key={e.name + "table"}>
                <TableCell className="font-medium">
                  {capitalizeEachWord(e.name)}
                </TableCell>
                <TableCell className="">
                  {e.sets.length === 0 ? (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-secondary"
                    >
                      -
                    </Button>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          className="relative"
                          size="icon"
                          variant="ghost"
                        >
                          <Info
                            size={12}
                            className="absolute top-1 right-1"
                          />
                          {e.sets.length}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Set Information</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {e.sets.map((s, i) => (
                          <DropdownMenuItem key={`set-${i}`}>
                            Set-{i + 1} : {getTextFromReps(s.reps)} reps{" "}
                            {`${s.weight ? " ," + s.weight + " kg " : ""}`}(
                            {s.avgRepTime <= 1.5 ? "explosive" : "controlled"})
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
                <TableCell>{convertMinutesToText(e.duration)}</TableCell>
                <TableCell className="">{e.calories} Kcal</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
export default ExerciseTable;
