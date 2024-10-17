export const groupBy = <Input>(array: Input[], key: keyof Input) => {
  return array.reduce((acc, item) => {
    const k = item[key];
    // @ts-expect-error
    if (!acc[k]) {
      // @ts-expect-error
      acc[k] = [];
    }
    // @ts-expect-error
    acc[k].push(item);
    return acc;
  }, {} as Record<string, Input[]>);
};

export function capitalizeFirstLetter(str: string) {
  if (str.length === 0) return str; // Return empty string if input is empty
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export function capitalizeEachWord(str: string) {
  if (str.length === 0) return str; // Return empty string if input is empty
  const words = str.split(" "); // Split the string into an array of words
  words.forEach((word, index) => {
    words[index] = word.charAt(0).toUpperCase() + word.slice(1);
  }); // Capitalize the first letter of each word

  return words.join(" "); // Join the words back together with a space in between
}

export function caloriePerMin(met: number, weight: number) {
  return ((met * 3.5 * weight) / 200).toFixed(1);
}

/**
 * Calculate calories burned based on the number of steps taken, height, and weight.
 *
 * @param {number} height - Height of the person in cm.
 * @param {number} weight - Weight of the person in kilograms.
 * @param {number} steps - Total number of steps taken.
 * @returns {number} - Estimated calories burned.
 */
export function stepsToCal(
  height: number,
  weight: number,
  steps: number
): number {
  const h = height / 100;
  return Number(((5.05 * weight * h * steps) / 16094).toFixed(2));
}

export function convertMinutesToText(decimalMinutes: number) {
  const minutes = Math.floor(decimalMinutes); // Get the whole minutes
  const seconds = Math.round((decimalMinutes - minutes) * 60); // Convert the decimal part to seconds
  return `${minutes > 0 ? minutes + " min " : ""}${seconds} sec`;
}

export function isObjectId(id: string) {
  return /^[a-fA-F0-9]{24}$/.test(id);
}
