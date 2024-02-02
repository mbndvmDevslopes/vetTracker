import { useEffect, useState } from 'react';

import { UsersContainer } from '../Components/UsersContainer';
import { AllUsers } from '../Types';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [allUsers, setAllUsers] = useState<AllUsers[] | null>(null);
  const navigate = useNavigate();

  const getAllUsers = async () => {
    try {
      const { data } = await customFetch.get('/user/admin/all-users');

      setAllUsers(data);
    } catch (error) {
      toast.error('You are not authorized to access this page');
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <>
      <h2>Users</h2>
      <UsersContainer allUsers={allUsers} />
    </>
  );
};

export default Admin;
