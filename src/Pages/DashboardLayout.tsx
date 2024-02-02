import { createContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { BigSidebar } from '../Components/BigSidebar';
import SmallSidebar from '../Components/SmallSidebar';
import Wrapper from '../assets/Wrappers/Dashboard';
import { Navbar } from './Navbar';
import { checkDefaultTheme } from '../utils/CheckDefaultTheme';
import { toast } from 'react-toastify';
import { useCurrentUser } from '../providers/useCurrentUser';
import customFetch from '../utils/customFetch';
import { AxiosError } from 'axios';
import { Conditions, User } from '../Types';

type TDashboardProvider = {
  toggleSidebar: () => void;
  user: User | null;
  logoutUser: () => void;
  toggleDarkTheme: () => void;
  showSidebar: boolean;
  isDarkTheme: boolean;
  conditions: Conditions[] | null;
  setConditions: React.Dispatch<React.SetStateAction<Conditions[] | null>>;
  refetchConditions: () => void;
};

export const DashboardContext = createContext<TDashboardProvider>(
  {} as TDashboardProvider
);

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { user, setUser, getCurrentUser } = useCurrentUser();
  const [conditions, setConditions] = useState<Conditions[] | null>(null);

  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(checkDefaultTheme());
  const [isAuthError, setIsAuthError] = useState<boolean>(false);

  customFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error?.response?.status === 401) {
        setIsAuthError(true);
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const fetchUser = async () => {
      await getCurrentUser();
    };
    fetchUser();
    refetchConditions();
    if (!isAuthError) return;
    logoutUser();
  }, [isAuthError]);

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    document.body.classList.toggle('dark-theme', newDarkTheme);
    const darkThemeString = newDarkTheme ? 'true' : 'false';
    localStorage.setItem('darkTheme', darkThemeString);
  };

  const refetchConditions = async () => {
    try {
      const fetchAllConditions = await customFetch.get('/conditions');
      setConditions(fetchAllConditions.data);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error?.response?.data?.msg);
      }
    }
  };
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const logoutUser = async () => {
    try {
      navigate('/');
      await customFetch.get('/auth/logout');
      toast.success('Logout Successful');
      setUser(null);
      setConditions(null);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error?.response?.data?.msg);
      }
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        showSidebar,
        toggleSidebar,
        toggleDarkTheme,
        isDarkTheme,
        logoutUser,
        conditions,
        setConditions,
        refetchConditions,
        user,
      }}
    >
      <Wrapper>
        <main className="dashboard">
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className="dashboard-page">
              <Outlet />
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};
export default DashboardLayout;
