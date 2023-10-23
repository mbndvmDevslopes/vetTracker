export const capitalize = (str: string) => {
  const words = str.toLowerCase().split(' ');
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return capitalizedWords.join(' ');
};

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
