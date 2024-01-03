import { FormEvent, useEffect, useState } from 'react';
import { useConditions } from '../providers/useConditions';
import { FormRowControlledInput } from '../Components/FormRowControlledInput';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Conditions } from '../Types';
import { capitalize } from '../utils/transformations';
import { useNavigate } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { useDashboardContext } from '../providers/useDashboardContext';

export const AddCondition = () => {
  /*   const { conditions, refetchConditions } = useConditions(); */
  const { conditions, refetchConditions } = useDashboardContext();
  const [newCondition, setNewCondition] = useState<Omit<Conditions, 'id'>>({
    conditionName: '',
  });
  const navigate = useNavigate();

  const checkIfConditionExists = (): boolean => {
    return (
      conditions?.some(
        (condition) =>
          condition.conditionName.toLowerCase() ===
          newCondition.conditionName.toLowerCase()
      ) ?? false
    );
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setNewCondition({
      ...newCondition,
      [e.target.name]: capitalize(e.target.value),
    });
  };

  useEffect(() => {
    refetchConditions();
  }, []);

  const createNewCondition = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const existingCondition = checkIfConditionExists();
    if (existingCondition) {
      toast.error('This condition already exists');
      return;
    }
    try {
      await customFetch.post('/conditions', {
        conditionName: newCondition.conditionName,
      });

      toast.success('Condition added successfully');

      await refetchConditions();
      navigate('/dashboard/all-conditions');

      /* return response; */
    } catch (error) {
      toast.error('Error adding condition');
    }
  };

  return (
    <form action="submit" className="form" onSubmit={createNewCondition}>
      <h4 className="form-title">Add New Condition</h4>
      <div className="form-center">
        <FormRowControlledInput
          type="text"
          name="conditionName"
          value={newCondition.conditionName}
          labelText="Type Name of New Condition Below"
          onChange={handleChange}
        />
        <button className="btn btn-block form-btn" type="submit">
          submit
        </button>
      </div>
    </form>
  );
};
