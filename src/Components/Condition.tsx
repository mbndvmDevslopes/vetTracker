import { Link, redirect } from 'react-router-dom';
import Wrapper from '../assets/Wrappers/Condition';
import { toast } from 'react-toastify';
import { useConditions } from '../providers/useConditions';
import customFetch from '../utils/customFetch';
import { AxiosError } from 'axios';

export const Condition = ({
  id,
  conditionName,
}: {
  id: string;
  conditionName: string;
}) => {
  const { refetchConditions } = useConditions();

  const deleteCondition = async () => {
    try {
      await customFetch.delete(`/conditions/${id}`);

      refetchConditions();
      return redirect('/dashboard/all-conditions');
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error?.response?.data?.msg);
      }
      return;
    }
  };

  const handleDeleteCondition = async () => {
    try {
      const response = await customFetch.get(`/checkUsage/${id}`);
      if (response.data.conditionInUse) {
        toast.error('Condition is in use and cannot be deleted.');
      } else {
        await deleteCondition();

        toast.success('Condition deleted successfully.');
      }
    } catch (error) {
      console.error(error);
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
