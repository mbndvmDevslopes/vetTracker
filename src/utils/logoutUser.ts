import { removeUserFromLocalStorage } from './LocalStorageUser';

import { toast } from 'react-toastify';

export const logoutUser = () => {
  removeUserFromLocalStorage();

  toast.success('Logging out');
};
