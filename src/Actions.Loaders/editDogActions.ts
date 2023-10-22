import { toast } from 'react-toastify';
import { DogType, DogsConditions } from '../Types';
import { capitalizeAndTrim, validateDate } from '../utils/transformations';
import { validateWeight } from '../utils/validation';
import axios from 'axios';
import { ActionFunction, redirect } from 'react-router-dom';
import { retrieveCurrentUser } from '../utils/RetrieveCurrentUser';

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
  const user = retrieveCurrentUser();

  const { id } = user;
  return { id };
};

const convertFormIdsToNumbers = (strIds: FormDataEntryValue[]) =>
  strIds.map((condition: FormDataEntryValue) => {
    if (typeof condition === 'string') {
      return parseInt(condition);
    }
  });

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  const { id } = getUserId();
  const dateVisitedValue = formData.get('dateVisited');

  const dogData: Omit<DogType, 'id'> = {
    sex: capitalizeAndTrim(formData.get('sex')?.toString()),
    name: capitalizeAndTrim(formData.get('name')?.toString()),
    breed: capitalizeAndTrim(formData.get('breed')?.toString()),
    birthDate: new Date(formData.get('birthDate') as string) || new Date(),

    weight: parseFloat(formData.get('weight') as string) || 0,
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
