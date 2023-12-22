import { Outlet, Navigate } from 'react-router-dom';
import customFetch from '../utils/customFetch';

/* const AuthRequired = () => {
  const loggedInUser = async () => {
    const { data } = await customFetch.get('/user/current-user');
    const loggedInUser = data.loggedInUserWithoutPassword;

    return loggedInUser;
  };

  if (!loggedInUser) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default AuthRequired; */

const AuthRequired = () => {
  const checkLoggedInUser = async () => {
    try {
      const { data } = await customFetch.get('/user/current-user');
      const loggedInUser = data.loggedInUserWithoutPassword;
      console.log('Logged In User:', loggedInUser);
      return loggedInUser;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  };

  /*   const user = loggedInUser();

  if (!user) {
    console.log('Redirecting to /login');
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};
 */

  const user = (async () => await checkLoggedInUser)();

  if (!user) {
    console.log('Redirecting to /login');
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};
export default AuthRequired;
