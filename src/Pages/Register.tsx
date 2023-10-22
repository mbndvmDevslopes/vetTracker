import { Form, Link, useNavigation } from 'react-router-dom';
import Wrapper from '../assets/Wrappers/RegisterPage';
import Logo from '../Components/Logo';
import { FormRow } from '../Components/FormRow';

const Register = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

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
          defaultValue=""
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
