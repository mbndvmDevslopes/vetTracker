import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getUser, getUserData } from '../api'; // Import the API function
import { User } from '../Types';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import { useNavigate } from 'react-router-dom';

/* import axios from "axios";
 */
type TCurrentUserProviderTypes = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  refetchUser: () => void;
  login: (userLoggingIn: { email: string; password: string }) => Promise<User>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  getCurrentUser: () => Promise<User>;
};
export const CurrentUserContext = createContext<TCurrentUserProviderTypes>(
  {} as TCurrentUserProviderTypes
);

export const CurrentUserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  /*  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  }); */
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getCurrentUser = async () => {
    try {
      const { data } = await customFetch.get('/user/current-user');
      const loggedInUser = data.loggedInUserWithoutPassword;

      setUser(loggedInUser);

      return loggedInUser;
    } catch (error) {
      await customFetch.get('/auth/logout');
      toast.success('Logout Successful');
      navigate('/');
    }
  };
  const login = async () => {
    /*  refetchUser(); */
    try {
      const { data } = await customFetch.get('/user/current-user');
      const loggedInUser = data.loggedInUserWithoutPassword;

      setUser(loggedInUser);

      return loggedInUser;
    } catch (error) {
      await customFetch.get('/auth/logout');
      toast.success('Logout Successful');
    }

    /* setIsLoading(true);
    try {
      console.log('hi');
      setIsLoading(false);
    } catch (error) {
      console.log('error');
    } */
    /*    const users = await getUser(userLoggingIn.email);
      const user = users.find(
        (user: User) => user.password === userLoggingIn.password
      );

      if (user) {
        setUser(user);

        localStorage.setItem('user', JSON.stringify(user));
        toast.success(`Thanks, Dr. ${user.lastName}, you are now logged in`);
        return user;
      } else {
        toast.warning('Invalid credentials');
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    } finally {
      setIsLoading(false);
    } */
  };

  const refetchUser = async () => {
    try {
      const { data } = await customFetch.get('/user/current-user');
      const loggedInUser = data.loggedInUserWithoutPassword;

      setUser(loggedInUser);

      return loggedInUser;
      /* const currentUser = data.data;
      setUser(currentUser);
      console.log(user); */
    } catch (error) {
      await customFetch.get('/auth/logout');
      toast.success('Logout Successful');
    }
  };
  /*   useEffect(() => {
    const fetchUserData = async () => {

      refetchUser();
    };

    fetchUserData();
  }, []); */
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await refetchUser();
        setIsLoading(false); // Set isLoading to false after successful user retrieval
      } catch (error) {
        setIsLoading(false); // Set isLoading to false in case of an error
      }
    };

    fetchUserData();
  }, []);

  return (
    <CurrentUserContext.Provider
      value={{
        user,
        setUser,
        refetchUser,
        login,
        setIsLoading,
        isLoading,
        getCurrentUser,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};
