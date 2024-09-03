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
