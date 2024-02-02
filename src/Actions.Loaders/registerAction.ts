import { ActionFunction, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import { AxiosError } from 'axios';


export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post('/auth/register', data);
    toast.success('Registration successful, redirecting to login...');
    return redirect('/login');
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      toast.error(error?.response?.data?.msg);
    }
    return error;
  }
};
