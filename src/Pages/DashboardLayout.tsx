import { createContext, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { BigSidebar } from '../Components/BigSidebar';
import SmallSidebar from '../Components/SmallSidebar';
import Wrapper from '../assets/Wrappers/Dashboard';
import { Navbar } from './Navbar';
import { checkDefaultTheme } from '../utils/CheckDefaultTheme';
import { toast } from 'react-toastify';
import { useCurrentUser } from '../providers/useCurrentUser';
import { useConditions } from '../providers/useConditions';

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

  const { user, setUser } = useCurrentUser();
  const { conditions } = useConditions();

  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(checkDefaultTheme());

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

  const logoutUser = () => {
    removeUserFromLocalStorage();
    setUser(null);
    navigate('/');
    toast.success('Logging out');
  };

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem('user');
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
              <Outlet context={{ user, conditions }} />
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};

export default DashboardLayout;
