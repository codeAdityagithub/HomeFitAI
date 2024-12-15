import { cn } from "@/lib/utils";
import { DashboardExercise } from "@/routes/dashboard+/workout+";
import { Link, useNavigate } from "@remix-run/react";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const WorkoutSearch = ({ exercises }: { exercises: DashboardExercise[] }) => {
    const [query, setQuery] = useState("");
    const [hidden, setHidden] = useState(true);
    const filtered = useMemo(
        () => exercises.filter((ex) => ex.name.includes(query.toLowerCase())),
        [query, exercises]
    );
    const navigate = useNavigate();
    return (
        <div
            onFocus={() => setHidden(false)}
            className="max-w-md relative"
        >
            <div
                onClick={() => {
                    setHidden(true);
                }}
                className={cn(hidden && "hidden", "fixed inset-0 z-30")}
            ></div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    setHidden(true);
                    if (query.trim() !== "") navigate("search?query=" + query);
                }}
                className=" flex items-center gap-2"
            >
                <Input
                    name="q"
                    className="z-40 bg-secondary"
                    placeholder="Search for exercises here..."
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button
                    type="submit"
                    size="icon"
                    className="h-9 w-9 z-40"
                >
                    <Search className="h-5 w-5" />
                </Button>
            </form>
            <div
                className={cn(
                    "absolute w-full top-12 z-50 rounded left-0 max-h-[400px] overflow-auto ver_scroll bg-secondary text-secondary-foreground drop-shadow-lg p-4",
                    query.trim().length < 1 ? "hidden" : "block",
                    hidden && "hidden"
                )}
            >
                {query.trim().length >= 1 &&
                    filtered.length > 0 &&
                    filtered.map((ex) => {
                        const lower = query.toLowerCase();
                        const start = ex.name.indexOf(lower);
                        const pre = ex.name.slice(0, start);
                        const end = ex.name.slice(start + query.length);
                        return (
                            <Link
                                to={ex.id}
                                key={ex.id + "search"}
                                className="block p-2 hover:bg-primary rounded cursor-pointer"
                            >
                                {pre}
                                <span className="text-accent">{lower}</span>
                                {end}
                            </Link>
                        );
                    })}
                {query.trim().length >= 1 && filtered.length === 0 && (
                    <div className="text-center">
                        No matching exercises found.
                    </div>
                )}
            </div>
        </div>
    );
};
export default WorkoutSearch;
