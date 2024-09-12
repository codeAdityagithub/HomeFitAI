import { DateTime } from "luxon";

export function getDayDiff(d1: Date, d2: Date) {
  const date1 = DateTime.fromJSDate(d1);
  const date2 = DateTime.fromJSDate(d2);

  // Calculate the difference in days
  const diffInDays = date2.diff(date1, "days").as("days");
  return Math.floor(Math.abs(diffInDays));
}
