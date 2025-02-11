export const formatDate = (date: Date | null | undefined) => {
  if (date === null || date === undefined) {
    return 'N/A';
  }

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};
