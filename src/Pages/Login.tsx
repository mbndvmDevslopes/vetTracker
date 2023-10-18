import {
  Form,
  redirect,
  Link,
  ActionFunction,
  useNavigate,
} from 'react-router-dom';
import Wrapper from '../assets/Wrappers/RegisterPage';
import Logo from '../Components/Logo';
import { FormRow } from '../Components/FormRow';
import { toast } from 'react-toastify';
import { User } from '../Types';
import { useCurrentUser } from '../providers/CurrentUserProvider';
import { FormEvent, useState } from 'react';
import { FormRowControlledInput } from '../Components/FormRowControlledInput';
import { addUserToLocalStorage } from '../utils/LocalStorageUser';

export const action: ActionFunction = async ({ request }) => {
  /* const formData = await request.formData();

  const data = Object.fromEntries(formData);

  const { email, password } = data; */
  return null;
};

const Login = () => {
  const { login, isLoading } = useCurrentUser();
  const [userLoginData, setUserLoginData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      const loggedInUser = await login(userLoginData);
      // Check if login was successful
      if (loggedInUser) {
        // Navigate to /dashboard after successful login
        navigate('/dashboard');
      } else {
      
        toast.error('Invalid credentials');
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      navigate('/');
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserLoginData({ ...userLoginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
 
    loginUser();
  };

  return (
    <Wrapper>
      <form className="form" onSubmit={handleLoginSubmit}>
        <Logo />
        <h4>Login</h4>

        <FormRowControlledInput
          name="email"
          type="email"
          labelText="email"
          value={userLoginData.email}
          onChange={handleChange}
        />
        <FormRowControlledInput
          name="password"
          type="password"
          labelText="password"
          value={userLoginData.password}
          onChange={handleChange}
        />

        <button className="btn btn-block">
          {isLoading ? 'Loading...' : 'submit'}
        </button>
        <p>
          Not yet registered?
          <Link className="member-btn" to="/register">
            Register
          </Link>
        </p>
      </form>
    </Wrapper>
  );
};

export default Login;
