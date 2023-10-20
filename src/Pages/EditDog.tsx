import { FormRow } from '../Components/FormRow';
import Wrapper from '../assets/Wrappers/DashboardFormPage';
import {
  Form,
  useNavigation,
  useNavigate,
  redirect,
  useLoaderData,
} from 'react-router-dom';
import type { ActionFunction, LoaderFunction } from 'react-router';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Conditions, DogType, DogsConditions } from '../Types';
import { retrieveCurrentUser } from '../utils/RetrieveCurrentUser';
import { validateWeight } from '../utils/validation';
import { useConditions } from '../providers/useConditions';
import { capitalizeAndTrim } from '../utils/transformations';
import { validateDate } from '../utils/transformations';

const getExistingDogsConditions = (id: number) => {
  return axios
    .get(`http://localhost:3000/dogsConditions?dogId=${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Error fetching existing dogsConditions:', error);
    });
};
export const loader: LoaderFunction = async ({ params }) => {
  try {
    console.log('edit dog params', params);
    const { data } = await axios.get(
      `http://localhost:3000/dogs?id=${params.id}`
    );
    console.log(data);
    const dog: DogType = data[0];

    const existingConditions = await getExistingDogsConditions(dog.id);
    const dogData = {
      dog: { ...dog },
      existingConditions: [...existingConditions],
    };
    console.log(dogData);
    return dogData;
  } catch (error) {
    toast.error('Error fetching dog:');
    return redirect('/dashboard/all-dogs');
  }
};
const postConditions = async (dogId: number, formConditions: number[]) => {
  const apiUrl = 'http://localhost:3000';

  try {
    // Fetch existing dogsConditions for the specific dog ID from the API endpoint
    const existingResponse = await axios.get(
      `${apiUrl}/dogsConditions?dogId=${dogId}`
    );
    const existingDogsConditions = existingResponse.data;

    // Remove conditions that are NOT selected in the form from the database
    const conditionsToRemove = existingDogsConditions
      .filter(
        (entry: DogsConditions) => !formConditions.includes(entry.conditionId)
      )
      .map((entry: DogsConditions) => entry.id);

    // Add conditions that are selected in the form to the database
    const conditionsToAdd = formConditions
      .filter(
        (conditionId) =>
          !existingDogsConditions.some(
            (entry: DogsConditions) => entry.conditionId === conditionId
          )
      )
      .map((conditionId) => {
        return {
          dogId: dogId,
          conditionId: conditionId,
        };
      });

    // Remove conditions from the database
    await Promise.all(
      conditionsToRemove.map((entryId: number) =>
        axios.delete(`${apiUrl}/dogsConditions/${entryId}`)
      )
    );

    // Add new conditions to the database
    await Promise.all(
      conditionsToAdd.map((conditionData) =>
        axios.post(`${apiUrl}/dogsConditions`, conditionData)
      )
    );

    console.log('Conditions updated successfully');
  } catch (error) {
    console.error('Error updating conditions:', error);
  }
};

const getUserId = () => {
  /*  const userFromLocalStorage = localStorage.getItem('user');
  const user = userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null; */
  const user = retrieveCurrentUser();

  const { id } = user;
  return { id };
};
export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  /*   const data = Object.fromEntries(formData); */

  const { id } = getUserId();
  const dateVisitedValue = formData.get('dateVisited');
  const dogData: Omit<DogType, 'id'> = {
    sex: capitalizeAndTrim(formData.get('sex')?.toString()),
    name: capitalizeAndTrim(formData.get('name')?.toString()),
    breed: capitalizeAndTrim(formData.get('breed')?.toString()),
    birthDate: new Date(formData.get('birthDate') as string) || new Date(),

    weight: parseFloat(formData.get('weight') as string) || 0,
    /* dateVisited: new Date(formData.get('dateVisited') as string | null),  */
    dateVisited: new Date(dateVisitedValue as string) || new Date(),

    notes: formData.get('notes')?.toString() || ''.trim(),

    vetId: id,
    ownerName: capitalizeAndTrim(formData.get('ownerName')?.toString()),
    isActive: formData.get('isActive') === 'true',
  };

  const selectedConditionIdsString = formData.getAll('condition[]');
  const formConditions = convertFormIdsToNumbers(selectedConditionIdsString);

  if (!validateDate(dogData.dateVisited)) {
    toast.error('Visit date cannot be in the future');
    return;
  }
  if (!validateDate(dogData.birthDate)) {
    toast.error('Birth date cannot be in the future');
    return;
  }
  if (!validateWeight(dogData.weight)) {
    toast.error('Weight must be a number greater than zero');
    return false;
  }

  const dogId = params.id ? parseInt(params.id) : 0;

  try {
    /* await axios.patch(`http://localhost:3000/dogs?id=${params.id}`, dogData); */
    await axios.patch(`http://localhost:3000/dogs/${params.id}`, dogData);

    const filteredConditions = formConditions.filter(
      (c) => c !== undefined
    ) as number[];

    postConditions(dogId, filteredConditions);

    toast.success('Dog edited successfully');
    return redirect('/dashboard/all-dogs');
  } catch (error) {
    toast.error('Error fetching dog:');
    return redirect('/dashboard/all-dogs');
  }
};

const convertFormIdsToNumbers = (strIds: FormDataEntryValue[]) =>
  strIds.map((condition: FormDataEntryValue) => {
    if (typeof condition === 'string') {
      return parseInt(condition);
    }
  });

export const EditDog: React.FC = () => {
  /* const dog: Dog = useLoaderData() as Dog; */
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const { conditions } = useConditions();
  /* const [conditions, setConditions] = useState<Condition[]>([]); */

  /* const dog: Dog = useLoaderData().dog as Dog;
  const existingConditions: Condition[] = useLoaderData().existingConditions; */
  /*   const {dog, existingConditions} = useLoaderData();*/
  const data = useLoaderData() as {
    dog: DogType;
    existingConditions: DogsConditions[];
  };

  const { dog, existingConditions } = data;

  const { conditions: allConditions } = useConditions();
  const [dogConditions, setDogConditions] = useState<Conditions[]>([]);

  useEffect(() => {
    // Filter conditions based on dogId and existing conditions
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
            defaultValue={dog.dateVisited.toString()}
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
            defaultValue={dog.birthDate.toString()}
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
