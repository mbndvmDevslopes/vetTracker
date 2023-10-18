import { removeUserFromLocalStorage } from './LocalStorageUser';

import { toast } from 'react-toastify';

export const logoutUser = (id) => {
  removeUserFromLocalStorage();

  toast.success('Logging out');
};
