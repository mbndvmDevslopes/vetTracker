import "./App.css";

import { createBrowserRouter, Params, RouterProvider } from "react-router-dom";

import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Landing from "./Pages/LandingPage";
import Error from "./Pages/Error";
import AllDogs from "./Pages/AllDogs";
import { Profile } from "./Pages/Profile";
import Admin from "./Pages/Admin";
import AddDog from "./Pages/AddDog";
import DashboardLayout from "./Pages/DashboardLayout";
import { AllConditions } from "./Pages/AllConditions";
import { EditDog } from "./Pages/EditDog";

import { action as registerAction } from "./Pages/Register";
import { action as loginAction } from "./Pages/Login";
import { action as editDogAction } from "./Pages/EditDog";
import { loader as editDogLoader } from "./Pages/EditDog";
import { AddCondition } from "./Pages/AddCondition";
import { useState } from "react";
import { Conditions, DogType, User } from "./Types";
import { DogsContainer } from "./Components/DogsContainer";
import Search from "./Components/Search";

export const checkDefaultTheme = () => {
  const darkThemeString = localStorage.getItem("darkTheme") === "true";
  document.body.classList.toggle("dark-theme", darkThemeString);
  const darkTheme = darkThemeString === true ? true : false;
  return darkTheme;
};

checkDefaultTheme();

function App() {
  const [searchResults, setSearchResults] = useState<Conditions[]>([]);
  const router = createBrowserRouter([
    {
      path: "/",
      /* element: <LoginForm />, */
      element: <Home />,
      errorElement: <Error />,
      children: [
        {
          index: true,
          element: <Landing />,
        },
        {
          path: "register",
          element: <Register />,
          action: registerAction,
        },
        {
          path: "login",
          element: <Login />,
          action: loginAction,
        },
        {
          path: "dashboard",
          element: <DashboardLayout />,
          /*  loader: userLoader, */

          children: [
            {
              index: true,
              element: <AddDog />,
            },
            {
              path: "all-dogs",
              element: <AllDogs children={<DogsContainer />} />,
            },

            {
              path: "profile",
              element: <Profile />,
            },
            { path: "admin", element: <Admin /> },
            {
              path: "all-conditions",
              element: (
                <AllConditions
                  searchResults={searchResults}
                  setSearchResults={setSearchResults}
                />
              ),
            },
            {
              path: "edit-dog/:id",
              element: <EditDog />,
              action :editDogAction /* ({ request, params }: { params: Params; user: User }) =>
                Promise<false | Response | undefined> */,
              loader:editDogLoader  /* ({ params }: { params: Params }) =>
                Promise<
                  Response | { dog: DogType; existingConditions: Conditions[] }> */
                ,
            },
            { path: "add-condition", element: <AddCondition /> },
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;