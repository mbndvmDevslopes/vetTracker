import axios, { AxiosError } from 'axios';
import { ActionFunction, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

const checkDuplicateUser = async (email: string) => {
  try {
    const response = await fetch(`http://localhost:3000/users?email=${email}`);

    if (response.ok) {
      const users = await response.json();
      return users.length > 0;
    } else {
      throw new Error('Error checking for duplicate users');
    }
  } catch (error) {
    console.error('Error checking for duplicate users:', error);
    return false;
  }
};

export const action: ActionFunction = async ({ request }) => {
  console.log;
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const email = formData.get('email')?.toString() || '';
  const isDuplicateUser = await checkDuplicateUser(email);

  if (isDuplicateUser) {
    toast.error('Email already registered. Please use a different email.');
    return null;
  }

  try {
    const response = await axios.post('http://localhost:3000/users', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      toast.error('Error');
      return null;
    }
    toast.success('Registration successful, redirecting to login...');
    return redirect('/login');
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      toast.error(error.response?.data?.error);
    }
    return error;
  }
};
