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
  const { reFetchAllDogs, allDogs } = useAllDogsContext();
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
    console.log('supposed to be dog id', id);
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
      console.log(allDogs);
    }
  };

  const deleteDogConditions = async (id: string) => {
    /* try {
      // Fetch all dogsConditions records with the given dogId
      const response = await axios.get(
        `http://localhost:3000/dogsConditions?dogId=${id}`
      );

      // Iterate over the response data and delete each record
      const conditionsToDelete = response.data;
      const deletePromises = conditionsToDelete.map(
        async (condition: Conditions) => {
          await axios.delete(
            `http://localhost:3000/dogsConditions/${condition.id}`
          );
        }
      );

      // Wait for all delete operations to complete
      await Promise.all(deletePromises);
    } catch (error) {
      console.error(error);number
    } finally {
      setIsLoading(false);
    } */
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
          <DogInfo icon="Visited:" text={dateVisited} />
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
