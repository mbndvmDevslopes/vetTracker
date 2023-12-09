import { toast } from 'react-toastify';
import customFetch from './customFetch';
import { AxiosError } from 'axios';
import { redirect } from 'react-router-dom';

export const logoutUser = async () => {
  /* removeUserFromLocalStorage(); */
  try {
    await customFetch.get('/auth/logout');
    toast.success('Logout Successful');
    /* refetchUser(); */
    return redirect('/dashboard');
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      toast.error(error?.response?.data?.msg);
    }
  }
  toast.success('Logging out');
};
