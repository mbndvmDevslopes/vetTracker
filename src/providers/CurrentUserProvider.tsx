import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../Types';
import customFetch from '../utils/customFetch';
import { Outlet, useNavigate } from 'react-router-dom';

type TCurrentUserProviderTypes = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  refetchUser: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  getCurrentUser: () => Promise<User>;
};
export const CurrentUserContext = createContext<TCurrentUserProviderTypes>(
  {} as TCurrentUserProviderTypes
);

export const CurrentUserProvider: React.FC<{ children: ReactNode }> = () => {
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
      navigate('/');
    }
  };

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
    } catch (error) {
      setUser(null);
      navigate('/');
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await refetchUser();
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
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
        setIsLoading,
        isLoading,
        getCurrentUser,
      }}
    >
      <Outlet context={{ user }} />
    </CurrentUserContext.Provider>
  );
};
