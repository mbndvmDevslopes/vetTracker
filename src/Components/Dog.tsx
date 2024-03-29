import { Link, useNavigate } from 'react-router-dom';
import Wrapper from '../assets/Wrappers/Dog';
import { DogInfo } from './DogInfo';
import { DogType } from '../Types';
import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAllDogsContext } from '../providers/useAllDogs';
import { useCurrentUser } from '../providers/useCurrentUser';
import customFetch from '../utils/customFetch';
import dayjs from 'dayjs';
day.extend(advancedFormat);

export const Dog: React.FC<DogType> = ({
  id,
  name,
  breed,
  dateVisited,
  ownerName,
  isActive: initialIsActive,
}) => {
  const [isActive, setIsActive] = useState<boolean>(initialIsActive);
  const navigate = useNavigate();
  const { reFetchAllDogs } = useAllDogsContext();
  const { isLoading, setIsLoading } = useCurrentUser();

  const toggleActive = async () => {
    try {
      await customFetch.patch(`dogs/${id}/activeStatus`, {
        isActive: !isActive,
      });
      setIsActive(!isActive);
    } catch (error) {
      setIsActive(!isActive);
      console.log(error);
    }
  };
  const deleteDog = async () => {
    setIsLoading(true);
    try {
      await deleteDogConditions(id);
      await customFetch.delete(`dogs/${id}`);
      await reFetchAllDogs();
      toast.success('Dog successfully Deleted');
    } catch (error) {
      toast.error('Error deleting dog');
    } finally {
      setIsLoading(false);
      navigate('/dashboard/all-dogs');
    }
  };

  const deleteDogConditions = async (id: string) => {
    try {
      await customFetch.delete(`dogs/${id}/dogsConditions`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{name.charAt(0)}</div>
        <div className="info">
          <h5>{name}</h5>
          <p>{breed}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <DogInfo
            icon="Visited:"
            text={dayjs(dateVisited).format('MM-DD-YYYY')}
          />

          <DogInfo icon="Owner:" text={ownerName} />
          <div className={isActive ? `status true` : 'status false'}>
            {isActive ? 'Active' : 'Not Active'}
          </div>
        </div>
        <footer className="actions">
          <Link to={`../edit-dog/${id}`} className="btn edit-btn">
            Edit/View
          </Link>{' '}
          <button type="button" className="btn edit-btn" onClick={toggleActive}>
            {isActive ? 'Set inactive' : 'Set as active'}
          </button>
          <button
            type="submit"
            className="btn edit-btn"
            disabled={isLoading}
            onClick={deleteDog}
          >
            {isLoading ? 'Loading...' : 'Delete Dog'}
          </button>
        </footer>
      </div>
    </Wrapper>
  );
};
