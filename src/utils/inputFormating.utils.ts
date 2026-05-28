export const parseCommaSeparated = (value: string): string[] => {
  return value.split(",").map((p) => p.trim());
};
