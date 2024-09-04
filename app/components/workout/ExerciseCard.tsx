import type { DashboardExercise } from "@/routes/dashboard+/workout+";
import { capitalizeFirstLetter } from "@/utils/general";

const ExerciseCard = ({ e }: { e: DashboardExercise }) => {
  return (
    // <li
    // className="flex flex-col items-start drop-shadow-md rounded-lg"
    // key={e.name}
    // >
    //   <img
    //     src={e.imageUrl}
    //     alt={e.name}
    //     className="w-full aspect-[17/9] object-cover rounded-lg"
    //     />
    //   <div className="flex-1">
    //     <h2 className="text-lg font-bold">{e.name.toUpperCase()}</h2>
    //     <p>Target: {e.target}</p>
    //     <p>Equipment: {e.equipment}</p>
    //   </div>
    // </li>
    <li
      className="flex flex-col items-start drop-shadow-md rounded-lg overflow-hidden max-w-[500px]"
      key={e.name}
    >
      <img
        src={e.imageUrl}
        alt={e.name}
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
            .map((m, i) => `${capitalizeFirstLetter(m)}${i === 1 ? "" : ", "}`)}
        </p>
        <p className="text-gray-100 text-sm lg:text-base font-[500]">
          Equipment: {e.equipment}
        </p>
      </div>
    </li>
  );
};
export default ExerciseCard;
