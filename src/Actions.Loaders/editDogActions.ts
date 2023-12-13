import { toast } from 'react-toastify';
import { DogType, DogsConditions } from '../Types';
import { capitalizeAndTrim, validateDate } from '../utils/transformations';
import { validateWeight } from '../utils/validation';
import { ActionFunction, redirect } from 'react-router-dom';
import customFetch from '../utils/customFetch';

const postConditions = async (dogId: string, formConditions: number[]) => {
  try {
    await customFetch.delete(`/dogs/${dogId}/dogsConditions`);
    await customFetch.post(`/dogs/${dogId}/dogsConditions`, {
      formConditions,
    });
    // Fetch existing dogsConditions for the specific dog ID from the API endpoint
    /* const existingResponse = await axios.get(
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
 */
    console.log('Conditions updated successfully');
  } catch (error) {
    console.error('Error updating conditions:', error);
  }
};
/* 
const getUserId = async () => {
  const { data } = await customFetch.get('/user/current-user');
  const loggedInUser = data.loggedInUserWithoutPassword;

  const id = loggedInUser.id;
  return id;
}; */

const convertFormIdsToNumbers = (strIds: FormDataEntryValue[]) =>
  strIds.map((condition: FormDataEntryValue) => {
    if (typeof condition === 'string') {
      return parseInt(condition);
    }
  });
const getFormDataDate = (value: FormDataEntryValue | null): string => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  // Handle other cases if needed
  return new Date().toISOString();
};
export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  /*const id = getUserId();  */

  const dogData: Omit<DogType, 'id' | 'vetId'> = {
    sex: capitalizeAndTrim(formData.get('sex')?.toString()),
    name: capitalizeAndTrim(formData.get('name')?.toString()),
    breed: capitalizeAndTrim(formData.get('breed')?.toString()),
    /* birthDate: new Date(formData.get('birthDate') as string) || new Date(), */

    birthDate: getFormDataDate(formData.get('birthDate')),
    dateVisited: getFormDataDate(formData.get('dateVisited')),

    weight: parseFloat(formData.get('weight') as string) || 0,

    notes: formData.get('notes')?.toString() || ''.trim(),

    ownerName: capitalizeAndTrim(formData.get('ownerName')?.toString()),
    isActive: formData.get('isActive') === 'true',
  };
  /* 

  const dogResponse = await customFetch.post('/dogs', newDog);
  const newDogId = dogResponse.data.newDog.id;
  console.log('newdogid', newDogId);
  await customFetch.post(`/dogs/${newDogId}/dogsConditions`, {
    selectedConditions,
  }); */
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

  const dogId = params.id ? params.id : '';

  try {
    /*      await axios.patch(`http://localhost:3000/dogs/${params.id}`, dogData); */
    await customFetch.post('/dogs', dogData);

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
