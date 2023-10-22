export const checkDefaultTheme = () => {
  const darkThemeString = localStorage.getItem('darkTheme') === 'true';
  document.body.classList.toggle('dark-theme', darkThemeString);
  const darkTheme = darkThemeString === true ? true : false;
  return darkTheme;
};
