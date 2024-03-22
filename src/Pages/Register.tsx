import { Link, useNavigate } from 'react-router-dom';
import Wrapper from '../assets/Wrappers/RegisterPage';
import Logo from '../Components/Logo';
import { FormEvent, useState } from 'react';
import { z } from 'zod';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { FormRowControlledInput } from '../Components/FormRowControlledInput';

const RegisterSchema = z.object({
  firstName: z.string().min(2, { message: 'First name is too short' }),
  lastName: z.string().min(2, { message: 'Last name is too short' }),
  email: z.string().email('Invalid email address'),
  password: z.string(),
});

const Register = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name in registerData) {
      setRegisterData({ ...registerData, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      RegisterSchema.parse(registerData);
      await customFetch.post('/auth/register', registerData);
      toast.success('Registration Successful');
      navigate('/login');
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.map((err) => toast.error(err.message));
      } else if (error instanceof AxiosError && error.response) {
        // toast.error(error.response.data.msg);
        toast.error('email already exists.  please retry');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <form className="form" onSubmit={handleSubmit}>
        <Logo />
        <h4>Register</h4>

        <FormRowControlledInput
          type="text"
          name="firstName"
          labelText=" First Name"
          value={registerData.firstName}
          onChange={handleChange}
        />
        <FormRowControlledInput
          type="text"
          name="lastName"
          labelText="Last Name"
          onChange={handleChange}
          value={registerData.lastName}
        />

        <FormRowControlledInput
          name="email"
          type="email"
          labelText="email"
          onChange={handleChange}
          value={registerData.email}
        />
        <FormRowControlledInput
          name="password"
          type="password"
          labelText="password"
          onChange={handleChange}
          value={registerData.password}
        />

        <button className="btn btn-block" disabled={isSubmitting}>
          {isSubmitting ? 'submitting' : 'submit'}
        </button>
        <p>
          Already registered?
          <Link className="member-btn" to="/login">
            Login
          </Link>
        </p>
      </form>
    </Wrapper>
  );
};

export default Register;
