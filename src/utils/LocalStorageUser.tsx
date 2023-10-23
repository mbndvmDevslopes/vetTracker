import { User } from '../Types';

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem('user');
};

export const retrieveCurrentUser = () => {
  const userFromLocalStorage = localStorage.getItem('user');
  const user = userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null;
  return user;
};

export const addUserToLocalStorage = ({ user }: { user: User }) => {
  localStorage.setItem('user', JSON.stringify(user));
};
