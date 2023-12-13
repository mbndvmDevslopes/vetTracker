export const capitalize = (str: string) => {
  const words = str.toLowerCase().split(' ');
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return capitalizedWords.join(' ');
};

export const validateDate = (formDate: string) => {
  const CurrentDate = new Date();

  if (new Date(formDate as string) > CurrentDate) {
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
export const visitDateNotBeforeBirthDate = (
  visitDate: string,
  birthDate: string
) => {
  if (new Date(visitDate) < new Date(birthDate)) {
    return false;
  }
  return true;
};