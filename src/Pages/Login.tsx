import { Link, useNavigate } from 'react-router-dom';
import Wrapper from '../assets/Wrappers/RegisterPage';
import Logo from '../Components/Logo';
import { useCurrentUser } from '../providers/useCurrentUser';
import { FormEvent, useState } from 'react';
import { FormRowControlledInput } from '../Components/FormRowControlledInput';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import { AxiosError } from 'axios';
import { z } from 'zod';

const LoginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string(),
});

export const Login = () => {
  const { isLoading, setIsLoading } = useCurrentUser();
  const [userLoginData, setUserLoginData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const loginUser = async () => {
    setIsLoading(true);
    try {
      await customFetch.post('/auth/login', userLoginData);
      toast.success('Login Successful');
      setIsLoading(false);
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error?.response?.data?.msg);
      }
      setIsLoading(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserLoginData({ ...userLoginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      LoginFormSchema.parse(userLoginData);
      await loginUser();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0]?.message);
      }
    }
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
