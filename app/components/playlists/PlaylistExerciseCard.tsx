import { Link } from "@remix-run/react";

const PlaylistExerciseCard = ({
  label,
  imageUrl,
  sets,
  id,
}: {
  label: string;
  imageUrl: string;
  sets: number;
  id: string;
}) => {
  return (
    <li className="grid grid-cols-3 gap-4 p-2 bg-secondary drop-shadow-sm hover:drop-shadow-md transition-all hover:shadow-lg rounded-lg overflow-hidden">
      <div className="overflow-clip rounded-sm">
        <img
          src={imageUrl}
          alt={label}
          loading="lazy"
          className="h-full aspect-[2/1] object-cover max-h-[80px] rounded-sm"
        />
      </div>
      <div className="col-span-2 flex flex-col items-start justify-center">
        <Link
          to={"/dashboard/workout/" + id}
          prefetch="intent"
          className="w-full"
        >
          <h2 className="text-lg lg:text-xl font-bold text-foreground capitalize">
            {label}
          </h2>

          <p className="text-muted-foreground text-sm lg:text-base font-bold">
            {sets} Sets
          </p>
        </Link>
      </div>
    </li>
  );
};
export default PlaylistExerciseCard;
