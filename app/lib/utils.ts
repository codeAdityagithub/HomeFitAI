import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function convertToCm(feet: number, inches: number): number {
    const feetToCm = feet * 30.48; // 1 foot = 30.48 cm
    const inchesToCm = inches * 2.54; // 1 inch = 2.54 cm
    return Math.round((feetToCm + inchesToCm) * 2) / 2;
}
export function convertToFeetInches(cm: number): {
    feet: number;
    inch: number;
} {
    const totalInches = cm / 2.54; // 1 inch = 2.54 cm
    const feet = Math.min(Math.floor(totalInches / 12), 8); // 1 foot = 12 inches
    const inch = Math.round(totalInches % 12);
    return { feet, inch };
}

export function getFormattedHeight(cm: number): string {
    const { feet, inch } = convertToFeetInches(cm);
    return `${feet}' ${inch}''`;
}

export function convertToLbs(kg: number) {
    return Number((kg * 2.20462).toFixed(2));
}
export function convertToKg(lbs: number) {
    return Number((lbs * 0.453592).toFixed(2));
}

export function combineRepsIntoOne({
    left,
    right,
}: {
    left: number;
    right: number;
}) {
    return parseFloat(`${left}.${right}`);
}

export function splitRepsIntoTwo(reps: number) {
    const left = Math.floor(reps);
    const right = reps.toString().split(".")[1]; // Get the part after the decimal

    return { left, right: right ? Number(right) : 0 };
}

export function getImageFromVideoId(videoId: string) {
    return `https://img.youtube.com/vi/${videoId.split("?")[0]}/sddefault.jpg`;
}

export const AchievementIcons = {
    FIRST_WORKOUT: "🏅",
    GOAL_ACHIEVED: "🎖",
    MILESTONE_REACHED: "🎯",
    PERSONAL_BEST: "🏆",
    STREAK: "🔥",
};

export const updateFavouriteExercises = (exercise: any) => {
    if (typeof localStorage === "undefined") return;

    const TIMEOUT_MS = 1000 * 60 * 5;

    const exercisesList = localStorage.getItem("exercisesList");
    let parsedExerciseArray: { id: string; count: number; time: number }[] = [];

    try {
        if (exercisesList) {
            parsedExerciseArray = JSON.parse(exercisesList);
            if (!Array.isArray(parsedExerciseArray)) {
                throw new Error("Invalid exercisesList");
            }
        }

        const now = Date.now();
        const index = parsedExerciseArray.findIndex(
            (e) => e.id === exercise.id
        );

        if (index === -1) {
            // Add new exercise
            if (parsedExerciseArray.length >= 10) {
                parsedExerciseArray.sort((a, b) => a.count - b.count);
                parsedExerciseArray.shift(); // Remove the least frequently accessed entry
            }
            parsedExerciseArray.push({ id: exercise.id, count: 1, time: now });
        } else {
            // Update existing exercise
            const { count, time } = parsedExerciseArray[index];
            if (now - time > TIMEOUT_MS) {
                parsedExerciseArray[index] = {
                    id: exercise.id,
                    count: count + 1,
                    time: now,
                };
            }
        }
    } catch (err) {
        // console.error("Error processing exercisesList:", err);
        parsedExerciseArray = [{ id: exercise.id, count: 1, time: Date.now() }];
    }

    localStorage.setItem("exercisesList", JSON.stringify(parsedExerciseArray));
};
