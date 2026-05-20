const isMoreThan10DaysAgo = (dateString: Date): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays > 10;
};

function convertDayMonthToMonthDay(dateStr: string): string {
  const [day, month, year] = dateStr.split("/");

  return `${month?.padStart(2, "0")}/${day?.padStart(2, "0")}/${year}`;
}

export { isMoreThan10DaysAgo, convertDayMonthToMonthDay };
