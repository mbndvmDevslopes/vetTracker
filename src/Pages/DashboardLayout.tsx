import { createContext, useContext, useState } from 'react';
import { Outlet, useLoaderData, redirect, useNavigate } from 'react-router-dom';
import { BigSidebar } from '../Components/BigSidebar';
import SmallSidebar from '../Components/SmallSidebar';
import Wrapper from '../assets/Wrappers/Dashboard';
import { Navbar } from './Navbar';
import { checkDefaultTheme } from '../App';
import { toast } from 'react-toastify';
import axios from 'axios';
import { retrieveCurrentUser } from '../utils/RetrieveCurrentUser';
import { getConditions } from '../api';
import { Conditions } from '../Types';
import {  useCurrentUser } from '../providers/useCurrentUser';
import { useConditions } from '../providers/useConditions';


type User = {
  name: string;
  email: string;
  lastName: string;
  password: string;
  id: number;
};
type TDashboardProvider = {
  toggleSidebar: () => void;

  logoutUser: () => void;
  toggleDarkTheme: () => void;
  showSidebar: boolean;
  isDarkTheme: boolean;
 
};

const DashboardContext = createContext<TDashboardProvider>(
  {} as TDashboardProvider
);
/* export const conditionLoader = async () => {
  try {
    
    const response = await fetch(`http://localhost:3000/conditions`);

    if (!response.ok) {
      throw new Error('Failed to fetch conditions');
    }

    const conditions = await response.json();
    return conditions;
  } catch (error) {
    console.error('Error fetching conditions:', error);

    return null;
  }
  return;
}; */

/* export const loader = async () => {
  getConditions();
  try {
    
    const user = retrieveCurrentUser();
    const { id } = user;

    if (!id) {
      throw new Error('User ID not found in local storage');
    }

   
    const response = await fetch(`http://localhost:3000/users/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userData: User = await response.json();

    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);

    return redirect('/');
  }
}; */

const DashboardLayout = () => {
  const navigate = useNavigate();
  /*  const userData = useLoaderData() as User;
  const conditions1 = useLoaderData(); */
  const { user, setUser } = useCurrentUser();
  const { conditions } = useConditions();
  /* const conditions = useLoaderData(); */
  // const user = { name: 'john' };
  /* console.log('userfrom dashboard', user);
  console.log('conditions from dasb', conditions); */
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

export const useDashboardContext = () => useContext(DashboardContext);

export default DashboardLayout;
