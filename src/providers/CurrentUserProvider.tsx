import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { getUserData } from '../api'; // Import the API function
import { User } from '../Types';
import { retrieveCurrentUser } from '../utils/RetrieveCurrentUser';
import { toast } from 'react-toastify';
import { addUserToLocalStorage } from '../utils/LocalStorageUser';

import axios from 'axios';

type TCurrentUserProviderTypes = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  refetchUser: () => void;
  login: (userLoggingIn: { email: string; password: string }) => Promise<User>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
const CurrentUserContext = createContext<TCurrentUserProviderTypes>(
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
      const response = await axios.get(
        `http://localhost:3000/users?email=${userLoggingIn.email}`
      );

      if (response.status === 200) {
        const users = response.data;

        const user = users.find(
          (user: User) => user.password === userLoggingIn.password
        );

        if (user) {
          setUser(user);
          /* addUserToLocalStorage(user); */
          localStorage.setItem('user', JSON.stringify(user));
          toast.success(`Thanks, Dr. ${user.name}, you are now logged in`);
          return user;
        } else {
          toast.warning('Invalid credentials');
          throw new Error('Invalid credentials');
        }
      } else {
        console.error('Error fetching user data');
        throw new Error('Error fetching user data');
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
        /*  console.log('user from context', userData); */
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

  console.log('user from context', user);

  return (
    <CurrentUserContext.Provider
      value={{ user, setUser, refetchUser, login, setIsLoading, isLoading }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};
export const useCurrentUser = () => useContext(CurrentUserContext);
