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
  const { refetchConditions, conditions } = useDashboardContext();
  const navigate = useNavigate();

  const deleteCondition = async () => {
    try {
      console.log('Before update:', conditions);
      await customFetch.delete(`/conditions/${id}`);
      toast.success('Condition deleted successfully.');
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error?.response?.data?.msg);
      }
    }
  };
  useEffect(() => {
    refetchConditions();
  }, []);

  const handleDeleteCondition = async () => {
    const response = await customFetch.get(`/checkUsage/${id}`);
    if (response.data.conditionInUse) {
      toast.error('Condition is in use and cannot be deleted.');
      return;
    }
    try {
      await deleteCondition();

      toast.success('Condition deleted successfully.');
      await refetchConditions();
      navigate('/dashboard/all-conditions');
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
