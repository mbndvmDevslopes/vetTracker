import { FormRowControlledInput } from '../Components/FormRowControlledInput';
import Wrapper from '../assets/Wrappers/DashboardFormPage';
import { useNavigation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useCurrentUser } from '../providers/CurrentUserProvider';
import { User } from '../Types';
import { FormEvent, useState } from 'react';
import { retrieveCurrentUser, removeUserFromLocalStorage, addUserToLocalStorage } from '../utils/LocalStorageUser';
import { capitalize } from '../utils/transformations';

type AmendedUser = {
  name: string;
  lastName: string;
  email: string;
};
export const Profile: React.FC = () => {
  /* const { userData } = useOutletContext(); */
  const { user, setUser, refetchUser } = useCurrentUser();

  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const [amendedUser, setAmendedUser] = useState<AmendedUser>({
    name: user!.name,
    lastName: user!.lastName,
    email: user!.email,
  });

  const updateUserInLocalStorage = (updatedUserData) => {
    const currentUser = user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updatedUserData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    }
    return null;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (e.target.type === 'text') {
    setAmendedUser({ ...amendedUser, [e.target.name]: capitalize(e.target.value) });
    return;
    }
    setAmendedUser({ ...amendedUser, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { id } = user;
    try {
      const response = await axios.patch(
        `http://localhost:3000/users/${id}`,
        amendedUser
      );
      const editedUser = response.data;
      updateUserInLocalStorage(editedUser)
      setUser(editedUser);
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
            name="name"
            labelText="name"
            onChange={handleChange}
            value={amendedUser?.name}
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
