import dayjs from 'dayjs';

export const getCurrentYearMonth = (): string => {
  return formatDateYearMonth(new Date());
};

export const formatDateYearMonth = (date: Date): string => {
  return dayjs(date).format('YYYY-MM');
};

export const formatDate = (date: Date): string => {
  return dayjs(date).format('YYYY-MM-DD');
};

export const removeFormByIndex = (details: any[], indexToRemove: number) => {
  const updatedDetails = [...details];
  updatedDetails.splice(indexToRemove, 1);
  return updatedDetails;
};
