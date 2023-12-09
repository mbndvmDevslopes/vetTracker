import axios from 'axios';
import { LoaderFunction, redirect } from 'react-router-dom';
import { DogType } from '../Types';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';

/* const getExistingDogsConditions = async (id: number) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/dogsConditions?dogId=${id}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching existing dogsConditions:', error);
  }
};

export const loader: LoaderFunction = async ({ params }) => {
  try {
    const { data } = await axios.get(
      `http://localhost:3000/dogs?id=${params.id}`
    );
    const dog: DogType = data[0];

    const existingConditions = await getExistingDogsConditions(dog.id);
    const dogData = {
      dog: { ...dog },
      existingConditions: [...existingConditions],
    };
    return dogData;
  } catch (error) {
    toast.error('Error fetching dog:');
    return redirect('/dashboard/all-dogs');
  }
};
 */

const getExistingDogsConditions = async (id: string) => {
  try {
    const response = await customFetch.get(`/dogs/${id}/dogsConditions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching existing dogsConditions:', error);
  }
};

export const loader: LoaderFunction = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/dogs/${params.id}`);
    /* const dog: DogType = data[0]; */
    const dog = data.dog;
    console.log(data.dog);
    const existingConditions = await getExistingDogsConditions(data.dog.id);
    const dogData = {
      dog: { ...dog },
      existingConditions: [...existingConditions],
    };
    return dogData;
  } catch (error) {
    toast.error('Error fetching dog:');
    return redirect('/dashboard/all-dogs');
  }
};
