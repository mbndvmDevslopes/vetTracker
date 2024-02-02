import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Wrapper from '../assets/Wrappers/DashboardFormPage';
import { toast } from 'react-toastify';
import { validateWeight } from '../utils/validation';
import { SubmitBtn } from '../Components/SubmitBtn';

import { FormRowControlledInput } from '../Components/FormRowControlledInput';
import { capitalize } from '../utils/transformations';
import customFetch from '../utils/customFetch';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useDashboardContext } from '../providers/useDashboardContext';

dayjs.extend(utc);

const AddDog = () => {
  const { conditions } = useDashboardContext();

  const [newDog, setNewDog] = useState({
    sex: 'F',
    name: 'Fido',
    breed: 'Poodle',
    birthDate: '',
    weight: 0,
    dateVisited: '',
    notes: '',

    isActive: true,
    ownerName: '',
  });
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target.type === 'text') {
      setNewDog({ ...newDog, [e.target.name]: capitalize(e.target.value) });
      return;
    }
    setNewDog({ ...newDog, [e.target.name]: e.target.value });
  };
  const handleMultiselectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedConditions(selectedOptions);
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateWeight(newDog.weight)) {
      toast.error('Weight must be a number greater than zero');
      return false;
    }
    try {
      const dogResponse = await customFetch.post('/dogs', {
        ...newDog,
        birthDate: dayjs(newDog.birthDate).utc().format(),
        dateVisited: dayjs(newDog.dateVisited).utc().format(),
      });
      const newDogId = dogResponse.data.newDog.id;
      await customFetch.post(`/dogs/${newDogId}/dogsConditions`, {
        selectedConditions,
      });

      toast.success('Dog added successfully');
      navigate('/dashboard/all-dogs');
    } catch (error) {
      console.error('Error adding dog:', error);
      toast.error('Failed to add dog');
      return error;
    }
  };

  return (
    <Wrapper>
      <form onSubmit={handleSubmit} className="form">
        <h4 className="form-title">Add Dog</h4>
        <div className="form-center">
          <FormRowControlledInput
            type="text"
            name="name"
            labelText="Name"
            value={newDog.name}
            onChange={handleChange}
          />
          <FormRowControlledInput
            type="text"
            name="ownerName"
            labelText="Owner's Name"
            value={newDog.ownerName}
            onChange={handleChange}
          />
          <FormRowControlledInput
            type="text"
            name="breed"
            labelText="Breed"
            value={newDog.breed}
            onChange={handleChange}
          />
          <FormRowControlledInput
            type="text"
            name="sex"
            labelText="Sex"
            value={newDog.sex}
            onChange={handleChange}
          />
          <FormRowControlledInput
            type="number"
            name="weight"
            labelText="Weight"
            value={newDog.weight.toString()}
            onChange={handleChange}
          />
          <FormRowControlledInput
            type="date"
            name="birthDate"
            labelText="Birth Date"
            value={newDog.birthDate}
            onChange={handleChange}
            max={new Date().toLocaleDateString('en-ca')}
          />

          <FormRowControlledInput
            type="date"
            name="dateVisited"
            labelText="Date Visited"
            value={newDog.dateVisited}
            onChange={handleChange}
            max={new Date().toLocaleDateString('en-ca')}
          />
          <div className="form-row">
            <label htmlFor="notes" className="form-label">
              Notes
            </label>
            <textarea
              className="form-textarea"
              name="notes"
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-row">
            <label htmlFor="condition" className="form-label">
              Condition
            </label>

            <select
              className="multi-select form-select"
              name="condition"
              id="condition"
              multiple
              onChange={handleMultiselectChange}
              value={selectedConditions}
            >
              {conditions?.map((condition) => (
                <option key={condition.id} value={condition.id}>
                  {condition.conditionName}
                </option>
              ))}
            </select>
          </div>
          <SubmitBtn formBtn />
        </div>
      </form>
    </Wrapper>
  );
};

export default AddDog;
