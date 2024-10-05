import { Link } from "@remix-run/react";

const PlaylistCard = ({
  label,
  imageUrl,
  exercises,
  id,
}: {
  label: string;
  imageUrl: string;
  exercises: number;
  id: string;
}) => {
  return (
    <li className="flex flex-col items-start drop-shadow-md hover:shadow-accent/30 hover:shadow-lg hover:opacity-100 hover:-translate-y-1 transition-all rounded-lg overflow-hidden max-w-[500px] min-w-[200px] min-h-[120px]">
      <Link
        to={"/dashboard/playlists/" + id}
        prefetch="intent"
      >
        <img
          src={imageUrl}
          alt={label}
          loading="lazy"
          className="w-full aspect-[17/9] object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] p-4 sm:p-3 lg:p-6 lg:px-4 flex flex-col items-start justify-center">
          <h2 className="text-lg lg:text-xl font-bold text-white">{label}</h2>

          <p className="text-gray-200 text-sm lg:text-base font-bold">
            {exercises} Exercises
          </p>
        </div>
      </Link>
    </li>
  );
};
export default PlaylistCard;
