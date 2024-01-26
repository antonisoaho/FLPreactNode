import dayjs from 'dayjs';

export const getCurrentYearMonth = (): string => {
  return formatDate(new Date());
};

export const formatDate = (date: Date): string => {
  return dayjs(date).format('YYYY-MM');
};

export const removeFormByIndex = (details: any[], indexToRemove: number) => {
  const updatedDetails = [...details];
  updatedDetails.splice(indexToRemove, 1);
  return updatedDetails;
};
