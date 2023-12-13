import { useEffect, useState } from 'react';
import { FormRow } from '../Components/FormRow';
import Wrapper from '../assets/Wrappers/DashboardFormPage';
import {
  Form,
  useNavigation,
  useNavigate,
  useLoaderData,
} from 'react-router-dom';
import { Conditions, DogType, DogsConditions } from '../Types';
import { useConditions } from '../providers/useConditions';
import dayjs from 'dayjs';

export const EditDog: React.FC = () => {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const { conditions } = useConditions();

  const data = useLoaderData() as {
    dog: DogType;
    existingConditions: DogsConditions[];
  };

  const { dog, existingConditions } = data;

  const { conditions: allConditions } = useConditions();
  const [dogConditions, setDogConditions] = useState<Conditions[]>([]);

  useEffect(() => {
    const filteredConditions = allConditions?.filter((condition) =>
      existingConditions.some(
        (existingCondition) => existingCondition.conditionId === condition.id
      )
    );
    filteredConditions ? setDogConditions(filteredConditions) : '';
  }, [allConditions, existingConditions]);

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">edit {dog.name}</h4>

        <div className="form-center">
          <FormRow
            type="text"
            name="name"
            defaultValue={dog.name}
            labelText="Name"
          />
          <FormRow
            type="text"
            name="ownerName"
            defaultValue={dog.ownerName}
            labelText="Owner's Name"
          />
          <FormRow
            type="text"
            name="breed"
            defaultValue={dog.breed}
            labelText="Breed"
          />
          <FormRow
            type="text"
            name="sex"
            defaultValue={dog.sex}
            labelText="Sex"
          />

          <FormRow
            type="date"
            name="dateVisited"
            labelText="Date Visited"
            defaultValue={
              dayjs(dog.dateVisited).format('YYYY-MM-DD') ||
              dayjs().format('YYYY-MM-DD')
            }
            max={new Date().toLocaleDateString('en-ca')}
          />
          <FormRow
            type="string"
            name="weight"
            defaultValue={dog.weight as string | number}
            labelText="Weight"
          />
          <FormRow
            type="date"
            name="birthDate"
            labelText="Birth Date"
            defaultValue={
              dayjs(dog.birthDate).format('YYYY-MM-DD') ||
              dayjs().format('YYYY-MM-DD')
            }
            max={new Date().toLocaleDateString('en-ca')}
          />
          <div className="form-row">
            <label htmlFor="notes" className="form-label">
              Notes
            </label>
            <textarea
              className="form-textarea"
              name="notes"
              defaultValue={dog.notes}
            ></textarea>
          </div>
          <div className="form-row">
            <label htmlFor="condition" className="form-label">
              Condition
            </label>

            <select
              className="multi-select form-select"
              name="condition[]"
              id="condition"
              multiple // Allow multiple selections
            >
              {conditions?.map((condition) => (
                <option key={condition.id} value={condition.id}>
                  {condition.conditionName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <h5 className="form-label">Current Conditions:</h5>
            <ul className="conditions-list form-textarea">
              {dogConditions.map((condition) => (
                <li key={condition.id}>{condition.conditionName}</li>
              ))}
            </ul>
          </div>
          <div>
            <button
              type="submit"
              className="btn btn-block form-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting' : 'Submit'}
            </button>
            <button
              type="button"
              className="btn btn-block form-btn"
              disabled={isSubmitting}
              onClick={() => {
                navigate('/dashboard/all-dogs');
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Form>
    </Wrapper>
  );
};
