import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getUser, getUserData } from '../api'; // Import the API function
import { User } from '../Types';
import { retrieveCurrentUser } from '../utils/RetrieveCurrentUser';
import { toast } from 'react-toastify';

/* import axios from "axios";
 */
type TCurrentUserProviderTypes = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  refetchUser: () => void;
  login: (userLoggingIn: { email: string; password: string }) => Promise<User>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
export const CurrentUserContext = createContext<TCurrentUserProviderTypes>(
  {} as TCurrentUserProviderTypes
);

export const CurrentUserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (userLoggingIn: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const users = await getUser(userLoggingIn.email);
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
    }
  };

  const refetchUser = async () => {
    const currentUser = await retrieveCurrentUser();
    if (currentUser !== null) {
      try {
        const userData = await getUserData(currentUser.id);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      refetchUser();
    };

    fetchUserData();
  }, []);

  return (
    <CurrentUserContext.Provider
      value={{ user, setUser, refetchUser, login, setIsLoading, isLoading }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};
