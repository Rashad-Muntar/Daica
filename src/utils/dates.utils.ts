const isMoreThan10DaysAgo = (dateString: Date): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays > 10;
};

export { isMoreThan10DaysAgo };
