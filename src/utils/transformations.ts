export const validateDate = (formDate: Date) => {
  const CurrentDate = new Date();

  if (formDate > CurrentDate) {
    return false;
  }
  return true;
};

export const capitalizeAndTrim = (value: string | null | undefined) => {
  if (value) {
    return value.trim().charAt(0).toUpperCase() + value.trim().slice(1);
  }
  return '';
};
