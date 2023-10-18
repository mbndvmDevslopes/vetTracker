import {
  Form,
  redirect,
  Link,
  ActionFunction,
  useNavigation,
} from 'react-router-dom';
import Wrapper from '../assets/Wrappers/RegisterPage';
import Logo from '../Components/Logo';
import { FormRow } from '../Components/FormRow';
import { toast } from 'react-toastify';
import axios from 'axios';

/*  const userExists = users.find((user) => {
    if (user.password === loginPassword && user.userName === loginuserName)
      return;
  }); */

/*  const resetForm = () => {
    setCurrentUser({ userName: '', password: '', id: 0 });
  }; */

/* const toggleRegistered = () => {
  setFormValues({
    ...formValues,
    iuserAppContextsRegistered: !formValues.isRegistered,
  });
};*/

const checkDuplicateUser = async (email: string) => {
  try {
    const response = await fetch(
      /*  `http://localhost:3000/veterinarians?email=${email}` */
      `http://localhost:3000/users?email=${email}`
    );

    if (response.ok) {
      const users = await response.json();
      return users.length > 0;
    } else {
      throw new Error('Error checking for duplicate users');
    }
  } catch (error) {
    console.error('Error checking for duplicate users:', error);
    return false;
  }
};

export const action: ActionFunction = async ({ request }) => {
  console.log;
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log(data);
  console.log(data.email);
  const isDuplicateUser = await checkDuplicateUser(data.email);
  console.log(isDuplicateUser);
  if (isDuplicateUser) {
    toast.error('Email already registered. Please use a different email.');
    return null;
  }

  /*  try {
    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      toast.error('Error');
      return null;
    } */
  try {
    const response = await axios.post('http://localhost:3000/users', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.status === 200) {
      toast.error('Error');
      return null;
    }
    toast.success('Registration successful');
    return redirect('/login');
  } catch (error) {
    toast.error(error.response?.data?.error);
    return error;
  }
};
const Register = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  /*  const [formValues, setFormValues] = useState(initialState);
  const { displayAlert, registerUser, user, loginUser } = useAppContext(); */

  /*  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  }; */
  /* const navigate = useNavigate();

  const toggleRegistered = () => {
    setFormValues({
      ...formValues,
      isRegistered: !formValues.isRegistered,
    });
  };
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password, isRegistered } = formValues;
    if (!email || !password || (!isRegistered && !name)) {
      displayAlert();
      return;
    } 
    const currentUser = { name, email, password };
    if (isRegistered) {
      loginUser(currentUser);
    } else {
      registerUser(currentUser);
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]); */
  return (
    <Wrapper>
      <Form className="form" method="post">
        <Logo />
        <h4>Register</h4>

        <FormRow type="text" name="name" labelText="name" defaultValue="John" />
        <FormRow
          type="text"
          name="lastName"
          labelText="Last Name"
          defaultValue="Smith"
        />

        <FormRow
          name="email"
          type="email"
          labelText="email"
          defaultValue="john@gmail.com"
        />
        <FormRow
          name="password"
          type="password"
          labelText="password"
          defaultValue="dog"
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
      </Form>
    </Wrapper>
  );
};

export default Register;
