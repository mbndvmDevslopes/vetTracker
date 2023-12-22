import { toast } from 'react-toastify';
import { DogType } from '../Types';
import {
  capitalizeAndTrim,
  validateDate,
  visitDateNotBeforeBirthDate,
} from '../utils/transformations';
import { validateWeight } from '../utils/validation';
import { ActionFunction, redirect } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const postConditions = async (dogId: string, selectedConditions: string[]) => {
  try {
    await customFetch.delete(`/dogs/${dogId}/dogsConditions`);
    await customFetch.post(`/dogs/${dogId}/dogsConditions`, {
      selectedConditions,
    });
    console.log('Conditions updated successfully');
  } catch (error) {
    console.error('Error updating conditions:', error);
  }
};
export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  const dogData: Omit<DogType, 'id' | 'vetId'> = {
    sex: capitalizeAndTrim(formData.get('sex')?.toString()),
    name: capitalizeAndTrim(formData.get('name')?.toString()),
    breed: capitalizeAndTrim(formData.get('breed')?.toString()),
    birthDate: formData.get('birthDate') as string,

    dateVisited: formData.get('dateVisited') as string,

    weight: parseFloat(formData.get('weight') as string) || 0,

    notes: formData.get('notes')?.toString() || ''.trim(),

    ownerName: capitalizeAndTrim(formData.get('ownerName')?.toString()),
    isActive: formData.get('isActive') === 'true',
  };

  const formConditions = formData.getAll('condition[]');

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
  if (!visitDateNotBeforeBirthDate(dogData.dateVisited, dogData.birthDate)) {
    toast.error('Dog cannot visit before birth date');
    return false;
  }
  const dogId = params.id ? params.id : '';

  try {
    await customFetch.patch(`/dogs/${dogId}`, {
      ...dogData,
      birthDate: dayjs(dogData.birthDate).utc().format(),
      dateVisited: dayjs(dogData.dateVisited).utc().format(),
    });

    const selectedConditions = formConditions.filter(
      (c) => c !== undefined
    ) as string[];
    await postConditions(dogId, selectedConditions);

    toast.success('Dog edited successfully');
    return redirect('/dashboard/all-dogs');
  } catch (error) {
    toast.error('Error fetching dog:');
    return redirect('/dashboard/all-dogs');
  }
};
