import {
  Link,
  redirect,
  useNavigate,
  useOutletContext,
} from 'react-router-dom';
import Wrapper from '../assets/Wrappers/Condition';
import { toast } from 'react-toastify';
import { useConditions } from '../providers/useConditions';
import customFetch from '../utils/customFetch';
import { AxiosError } from 'axios';
import { useDashboardContext } from '../providers/useDashboardContext';
import { useEffect } from 'react';

export const Condition = ({
  id,
  conditionName,
}: {
  id: string;
  conditionName: string;
}) => {
  /*  const { refetchConditions } = useConditions(); */
  const { refetchConditions, setConditions, conditions } =
    useDashboardContext();
  const navigate = useNavigate();

  const deleteCondition = async () => {
    try {
      console.log('Before update:', conditions);
      await customFetch.delete(`/conditions/${id}`);
      await refetchConditions();
      /* const updatedConditionsData = await customFetch.get('/conditions');
      const updatedConditions = updatedConditionsData.data;
      console.log('After update:', updatedConditions);
     
      setConditions(updatedConditions);
 */
      toast.success('Condition deleted successfully.');
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error?.response?.data?.msg);
      }
    } finally {
      /* setConditions(conditions); */
    }
  };
  useEffect(() => {
    refetchConditions();
  }, []);
  const handleDeleteCondition = async () => {
    try {
      const response = await customFetch.get(`/checkUsage/${id}`);
      if (response.data.conditionInUse) {
        toast.error('Condition is in use and cannot be deleted.');
      } else {
        await deleteCondition();

        toast.success('Condition deleted successfully.');
        redirect('/dashboard/all-conditions');
      }
    } catch (error) {
      console.error(error);
      return;
    } finally {
      console.log('conditions from condition', conditions);
    }
  };

  return (
    <Wrapper>
      <header>
        <div className="info">
          <h5>{conditionName}</h5>
        </div>
      </header>
      <div>
        <footer className="actions">
          <button
            type="submit"
            className="btn edit-btn"
            onClick={handleDeleteCondition}
          >
            Delete Condition
          </button>

          <Link to="/Dashboard" className="btn edit-btn">
            Cancel
          </Link>
        </footer>
      </div>
    </Wrapper>
  );
};
