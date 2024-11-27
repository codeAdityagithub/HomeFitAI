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
import { ExerciseLog, Log } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { Info, Search } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
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

function PastExerciseTable({ logs }: { logs: SerializeFrom<Log>[] }) {
  const [input, setInput] = useState("");

  const exercisesByDate = useMemo(() => {
    return logs.slice(1).reduce((acc, log) => {
      if (!acc[log.date]) acc[log.date] = [];
      for (const e of log.exercises) {
        acc[log.date].push(e);
      }
      return acc;
    }, {} as Record<string, SerializeFrom<ExerciseLog>[]>);
  }, [logs]);

  const filteredObject = useMemo(() => {
    const inp = input.toLowerCase();
    const obj = {} as typeof exercisesByDate;

    Object.entries(exercisesByDate).forEach(([date, exercises]) => {
      obj[date] = exercises.filter((e) => e.name.includes(inp));
    });
    return obj;
  }, [input, exercisesByDate]);
  const getTextFromReps = (reps: number) => {
    const { left, right } = splitRepsIntoTwo(reps);
    // console.log(right);
    if (right) {
      return `L: ${left}, R: ${right}`;
    }
    return left;
  };

  return (
    <Card className="flex flex-col gap-2 bg-secondary/50">
      <CardHeader className="flex flex-row flex-wrap gap-2 items-center justify-between pb-2">
        <CardTitle className="border-l-4 border-accent text-left pl-4">
          Past Exercises Logs
        </CardTitle>
        <div className="relative flex items-center gap-4">
          <Input
            placeholder="Search Exercises..."
            value={input}
            className="pl-10"
            onChange={(e) => setInput(e.target.value)}
            id="searchInput2"
          />
          <Label htmlFor="searchInput2">
            <Search className="absolute left-2 top-0 h-full text-muted-foreground" />
          </Label>
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
            {Object.entries(filteredObject).map(([date, exercises]) => (
              <Fragment key={date}>
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="font-medium text-xs text-muted-foreground text-center"
                  >
                    {new Date(date).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </TableCell>
                </TableRow>
                {exercises.map((e, index) => (
                  <TableRow key={`${e.name}-${date}`}>
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
                            <DropdownMenuLabel>
                              Set Information
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {e.sets.map((s, i) => (
                              <DropdownMenuItem key={`set-${i}`}>
                                Set-{i + 1} : {getTextFromReps(s.reps)} reps{" "}
                                {`${s.weight ? " ," + s.weight + " kg " : ""}`}(
                                {s.avgRepTime <= 1.5
                                  ? "explosive"
                                  : "controlled"}
                                )
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
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
export default PastExerciseTable;
