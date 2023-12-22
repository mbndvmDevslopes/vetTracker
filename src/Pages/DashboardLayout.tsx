import { createContext, useEffect, useState } from 'react';
import { Outlet, redirect, useNavigate } from 'react-router-dom';
import { BigSidebar } from '../Components/BigSidebar';
import SmallSidebar from '../Components/SmallSidebar';
import Wrapper from '../assets/Wrappers/Dashboard';
import { Navbar } from './Navbar';
import { checkDefaultTheme } from '../utils/CheckDefaultTheme';
import { toast } from 'react-toastify';
import { useCurrentUser } from '../providers/useCurrentUser';
import { useConditions } from '../providers/useConditions';
import customFetch from '../utils/customFetch';
import { AxiosError } from 'axios';

type TDashboardProvider = {
  toggleSidebar: () => void;

  logoutUser: () => void;
  toggleDarkTheme: () => void;
  showSidebar: boolean;
  isDarkTheme: boolean;
};

export const DashboardContext = createContext<TDashboardProvider>(
  {} as TDashboardProvider
);

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { user, setUser, getCurrentUser } = useCurrentUser();
  const { setConditions, conditions } = useConditions();

  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(checkDefaultTheme());
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      console.log('current user', currentUser);
      if (!currentUser) {
        setUser(null);
        redirect('/');
      }
    };
    fetchUser();
  }, []);
  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    document.body.classList.toggle('dark-theme', newDarkTheme);
    const darkThemeString = newDarkTheme ? 'true' : 'false';
    localStorage.setItem('darkTheme', darkThemeString);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const logoutUser = async () => {
    try {
      await customFetch.get('/auth/logout');
      toast.success('Logout Successful');
      setUser(null);
      setConditions(null);

      navigate('/');
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
