export const retrieveCurrentUser = () => {
  const userFromLocalStorage = localStorage.getItem('user');
  const user = userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null;
  return user;
};
