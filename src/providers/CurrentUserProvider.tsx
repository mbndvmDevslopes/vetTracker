import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../Types';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import { Outlet, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

/* import axios from "axios";


 */
type TCurrentUserProviderTypes = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  refetchUser: () => void;
  /* login: (userLoggingIn: { email: string; password: string }) => Promise<User>; */
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  getCurrentUser: () => Promise<User>;
};
export const CurrentUserContext = createContext<TCurrentUserProviderTypes>(
  {} as TCurrentUserProviderTypes
);

export const CurrentUserProvider: React.FC<{ children: ReactNode }> = () => {
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
      /*  await customFetch.get('/auth/logout');
      toast.success('Logout Successful'); */
      navigate('/');
    }
  };
  /* const login = async () => {
    try {
      const { data } = await customFetch.get('/user/current-user');
      const loggedInUser = data.loggedInUserWithoutPassword;

      setUser(loggedInUser);

      return loggedInUser;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error?.response?.data?.msg);
      }
      navigate('/');
    }
  }; */

  const refetchUser = async () => {
    try {
      const { data } = await customFetch.get('/user/current-user');
      const loggedInUser = data.loggedInUserWithoutPassword;

      setUser(loggedInUser);
      if (!loggedInUser) {
        setUser(null);
        navigate('/');
      }

      return loggedInUser;
      /* const currentUser = data.data;
      setUser(currentUser);
      console.log(user); */
    } catch (error) {
      /* await customFetch.get('/auth/logout');
      toast.success('Logout Successful'); */
      setUser(null);
      navigate('/');
    }
  };
  /*  useEffect(() => {
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
        navigate('/');
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
        /* login, */
        setIsLoading,
        isLoading,
        getCurrentUser,
      }}
    >
      {/* {children} */}
      <Outlet context={{ user }} />
    </CurrentUserContext.Provider>
  );
};
