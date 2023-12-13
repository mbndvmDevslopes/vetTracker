import { FormRowControlledInput } from '../Components/FormRowControlledInput';
import Wrapper from '../assets/Wrappers/DashboardFormPage';
import { useNavigation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCurrentUser } from '../providers/useCurrentUser';
import { FormEvent, useState } from 'react';
import { capitalize } from '../utils/transformations';
import customFetch from '../utils/customFetch';

type AmendedUser = {
  firstName: string;
  lastName: string;
  email: string;
};
export const Profile: React.FC = () => {
  /* const { userData } = useOutletContext(); */
  const { user, refetchUser } = useCurrentUser();

  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const [amendedUser, setAmendedUser] = useState<AmendedUser>({
    firstName: user!.firstName,
    lastName: user!.lastName,
    email: user!.email,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (e.target.type === 'text') {
      setAmendedUser({
        ...amendedUser,
        [e.target.name]: capitalize(e.target.value),
      });
      return;
    }
    setAmendedUser({ ...amendedUser, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    /* const id = user?.id; */
    try {
      await customFetch.patch('/user/update-user', amendedUser);

      refetchUser();
      return toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('There was an error updating the profile');
    }
  };

  return (
    <Wrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h4 className="form-title">profile</h4>
        <div className="form-center">
          <FormRowControlledInput
            type="text"
            name="firstName"
            labelText="First Name"
            onChange={handleChange}
            value={amendedUser?.firstName}
          />
          <FormRowControlledInput
            type="text"
            name="lastName"
            labelText="Last Name"
            onChange={handleChange}
            value={amendedUser?.lastName}
          />
          <FormRowControlledInput
            type="email"
            name="email"
            labelText="email"
            onChange={handleChange}
            value={amendedUser.email}
          />
          <button
            className="btn btn-block form-btn"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'submitting...' : 'submit'}
          </button>
        </div>
      </form>
    </Wrapper>
  );
};
