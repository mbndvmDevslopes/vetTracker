import './App.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Register from './Pages/Register';
import { Login } from './Pages/Login';
import Home from './Pages/Home';
import Landing from './Pages/LandingPage';
import Error from './Pages/Error';
import AllDogs from './Pages/AllDogs';
import { Profile } from './Pages/Profile';
import Admin from './Pages/Admin';
import AddDog from './Pages/AddDog';
import DashboardLayout from './Pages/DashboardLayout';
import { AllConditions } from './Pages/AllConditions';
import { EditDog } from './Pages/EditDog';

import { action as registerAction } from './Actions.Loaders/registerAction';
import { action as editDogAction } from './Actions.Loaders/editDogActions';
import { loader as editDogLoader } from './Actions.Loaders/editDogLoader';
import { AddCondition } from './Pages/AddCondition';
import { useState } from 'react';
import { Conditions } from './Types';
import { DogsContainer } from './Components/DogsContainer';
import { checkDefaultTheme } from './utils/CheckDefaultTheme';
import { CurrentUserProvider } from './providers/CurrentUserProvider';
import { ConditionsProvider } from './providers/ConditionsProvider';

checkDefaultTheme();

function App() {
  const [searchResults, setSearchResults] = useState<Conditions[]>([]);
  const router = createBrowserRouter([
    {
      element: <ConditionsProvider children={undefined} />,
      errorElement: <Error />,
    },
    {
      element: <CurrentUserProvider children={undefined} />,
      children: [
        {
          path: '/',

          element: <Home />,

          children: [
            {
              index: true,
              element: <Landing />,
            },
            {
              path: 'register',
              element: <Register />,
              action: registerAction,
            },
            {
              path: 'login',
              element: <Login />,
            },

            {
              path: 'dashboard',
              element: <DashboardLayout />,

              children: [
                {
                  index: true,
                  element: <AddDog />,
                },
                {
                  path: 'all-dogs',
                  element: <AllDogs children={<DogsContainer />} />,
                },

                {
                  path: 'profile',
                  element: <Profile />,
                },
                { path: 'admin', element: <Admin /> },
                {
                  path: 'all-conditions',
                  element: (
                    <AllConditions
                      searchResults={searchResults}
                      setSearchResults={setSearchResults}
                    />
                  ),
                },
                {
                  path: 'edit-dog/:id',
                  element: <EditDog />,
                  action: editDogAction,
                  loader: editDogLoader,
                },
                { path: 'add-condition', element: <AddCondition /> },
              ],
            },
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
