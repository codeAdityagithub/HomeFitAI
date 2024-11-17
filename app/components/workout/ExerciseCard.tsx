import type { DashboardExercise } from "@/routes/dashboard+/workout+";
import { capitalizeFirstLetter } from "@/utils/general";
import { Link } from "@remix-run/react";

const ExerciseCard = ({ e }: { e: DashboardExercise }) => {
  return (
    <li
      className="flex flex-col items-start drop-shadow-md hover:shadow-accent/30 hover:shadow-lg hover:opacity-100 hover:-translate-y-1 transition-all rounded-lg overflow-hidden max-w-[500px] min-w-[200px] min-h-[120px]"
      key={e.name}
    >
      <Link
        to={`/dashboard/workout/${e.id}`}
        prefetch="intent"
      >
        <img
          src={e.imageUrl}
          alt={e.name}
          loading="lazy"
          className="w-full aspect-[17/9] object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] p-4 sm:p-3 lg:p-6 lg:px-4 flex flex-col items-start justify-center">
          <h2 className="text-base lg:text-lg font-bold text-white">
            {e.name.toUpperCase()}
          </h2>
          <p className="text-gray-100 text-sm lg:text-base font-[500]">
            Other muscles:{" "}
            {e.secondaryMuscles
              .slice(0, 2)
              .map(
                (m, i) => `${capitalizeFirstLetter(m)}${i === 1 ? "" : ", "}`
              )}
          </p>
          <p className="text-gray-100 text-sm lg:text-base font-[500]">
            Equipment: {e.equipment}
          </p>
        </div>
      </Link>
    </li>
  );
};
export default ExerciseCard;
