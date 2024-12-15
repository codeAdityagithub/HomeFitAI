import { DashboardExercise } from "@/routes/dashboard+/workout+";
import { groupBy } from "@/utils/general";
import { useEffect, useMemo, useState } from "react";

const useExercises = (exercises: DashboardExercise[]) => {
    // All non changing parts
    const exercisesByTarget = useMemo(
        () => groupBy(exercises, "target"),
        [exercises]
    );
    const exercisesByEquipment = useMemo(
        () => groupBy(exercises, "equipment"),
        [exercises]
    );
    const bandGrouped = useMemo(
        () => groupBy(exercisesByEquipment["band"], "target"),
        [exercisesByEquipment]
    );
    const dumbbellGrouped = useMemo(
        () => groupBy(exercisesByEquipment["dumbbell"], "target"),
        [exercisesByEquipment]
    );
    const [favouriteList, setFavouriteList] = useState<
        typeof exercises | undefined
    >();
    useEffect(() => {
        const favs = localStorage.getItem("exercisesList");
        if (favs) {
            try {
                const favList = JSON.parse(favs);
                if (!Array.isArray(favList) || !favList[0]?.id)
                    throw new Error("Invalid favourite list");

                const exerciseList = exercises.filter((e) =>
                    favList.some((ex: any) => ex.id === e.id)
                );
                setFavouriteList(exerciseList);
            } catch (error) {
                setFavouriteList(undefined);
            }
        }
    }, []);

    // handling how many rows are visible
    const [bandRows, setBandRows] = useState(2);
    const [dumbRows, setDumbRows] = useState(2);
    const [favRows, setFavRows] = useState(3);

    function toggleBands() {
        setBandRows(bandRows === 2 ? Object.keys(bandGrouped).length : 2);
    }
    function toggleDumbbell() {
        setDumbRows(dumbRows === 2 ? Object.keys(dumbbellGrouped).length : 2);
    }
    function toggleFavourite() {
        setFavRows((prev) => (prev === 3 ? favouriteList?.length ?? 0 : 3));
    }
    return {
        exercisesByTarget,
        exercisesByEquipment,
        bandGrouped,
        dumbbellGrouped,
        toggleBands,
        toggleDumbbell,
        bandRows,
        dumbRows,
        favouriteList,
        favRows,
        toggleFavourite,
    };
};
export default useExercises;
