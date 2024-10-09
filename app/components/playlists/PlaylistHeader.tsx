import { cn } from "@/lib/utils";
import { PlaylistType } from "@/utils/exercises/playlists.server";
import { useParams, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";
import GoBack from "../GoBack";

const PlaylistHeader = ({ playlist }: { playlist: PlaylistType }) => {
  const pName = useParams().pId;
  const [sp, setSp] = useSearchParams();
  const cur = Number(sp.get("cur"));

  const itemRefs = useRef<HTMLSpanElement[]>(
    Array.from({ length: playlist.length })
  );

  useEffect(() => {
    if (itemRefs.current[cur]) {
      itemRefs.current[cur].scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
    }
  }, [cur]);
  return (
    <>
      <div className="flex gap-2 items-center mb-4">
        <GoBack />
        <h1 className="capitalize text-2xl font-bold">
          {pName?.split("_").join(" ").toLowerCase()}
        </h1>
      </div>
      <div className="flex gap-2 p-2 overflow-x-auto w-full *:min-w-fit ver_scroll snap-x">
        {playlist.map((e, i) => {
          return (
            <span
              ref={(el) => (itemRefs.current[i] = el!)}
              onClick={() => {
                if (i === cur) return;
                setSp((prev) => {
                  prev.set("cur", String(i));
                  return prev;
                });
              }}
              key={e.id}
              className={cn(
                "font-bold capitalize snap-center text-sm px-3 py-1.5 rounded-full outline outline-1 outline-secondary",
                i === cur && "text-accent bg-secondary"
              )}
            >
              {e.id.split("_").join(" ").toLowerCase()}
            </span>
          );
        })}
      </div>
    </>
  );
};
export default PlaylistHeader;
