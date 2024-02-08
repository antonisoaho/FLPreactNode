export const removeFormByIndex = (details: any[], indexToRemove: number) => {
  const updatedDetails = [...details];
  updatedDetails.splice(indexToRemove, 1);
  return updatedDetails;
};
