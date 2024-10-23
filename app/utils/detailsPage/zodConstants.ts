import { STATS_CONSTANTS } from "@/lib/constants";
import { getFormattedHeight, convertToLbs } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTime } from "luxon";
import { z } from "zod";

export const constants = STATS_CONSTANTS;

export const schema = z
  .object({
    unit: z.enum(["kgcm", "lbsft"]),
    height: z.number().positive("Height must be greater than 0."), // Positive number for height

    weight: z.number().positive("Weight must be greater than 0."), // Positive number for weight

    age: z
      .number()
      .int()
      .min(
        constants.MIN_AGE,
        `Age must be greater than ${constants.MIN_AGE} years.`
      )
      .max(
        constants.MAX_AGE,
        `Age must be less than ${constants.MAX_AGE} years.`
      ), // Positive integer for age
    gender: z.enum(["M", "F", "OTHER"]),
    goalWeight: z.number().positive("Goal weight must be greater than 0."), // Positive integer for goal
    timezone: z.string().refine((zone) => DateTime.now().setZone(zone).isValid),
  })
  // @ts-expect-error
  .refine(
    (data) => {
      let height = data.height;
      let weight = data.weight;
      let goal = data.goalWeight;
      return (
        height >= constants.MIN_HEIGHT &&
        height <= constants.MAX_HEIGHT &&
        weight >= constants.MIN_WEIGHT &&
        weight <= constants.MAX_WEIGHT &&
        goal >= constants.MIN_WEIGHT &&
        goal <= constants.MAX_WEIGHT
      );
    },
    (data) => {
      return {
        message:
          data.unit === "kgcm"
            ? {
                height:
                  data.height < constants.MIN_HEIGHT ||
                  data.height > constants.MAX_HEIGHT
                    ? `Height must be between ${constants.MIN_HEIGHT} and ${constants.MAX_HEIGHT} cm.`
                    : null,
                weight:
                  data.weight < constants.MIN_WEIGHT ||
                  data.weight > constants.MAX_WEIGHT
                    ? `Weight must be between ${constants.MIN_WEIGHT} and ${constants.MAX_WEIGHT} kg.`
                    : null,
                goalWeight:
                  data.goalWeight < constants.MIN_WEIGHT ||
                  data.goalWeight > constants.MAX_WEIGHT
                    ? `Goal weight must be between ${constants.MIN_WEIGHT} and ${constants.MAX_WEIGHT} kg.`
                    : null,
              }
            : {
                height:
                  data.height < constants.MIN_HEIGHT ||
                  data.height > constants.MAX_HEIGHT
                    ? `Height must be between ${getFormattedHeight(
                        constants.MIN_HEIGHT
                      )} and ${getFormattedHeight(constants.MAX_HEIGHT)}.`
                    : null,
                weight:
                  data.weight < constants.MIN_WEIGHT ||
                  data.weight > constants.MAX_WEIGHT
                    ? `Weight must be between ${convertToLbs(
                        constants.MIN_WEIGHT
                      )} and ${convertToLbs(constants.MAX_WEIGHT)}.`
                    : null,
                goalWeight:
                  data.goalWeight < constants.MIN_WEIGHT ||
                  data.goalWeight > constants.MAX_WEIGHT
                    ? `Goal weight must be between ${convertToLbs(
                        constants.MIN_WEIGHT
                      )} and ${convertToLbs(constants.MAX_WEIGHT)}.`
                    : null,
              },
        path: ["custom"],
      };
    }
  );

export const resolver = zodResolver(schema);
