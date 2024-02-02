import { LoaderFunction, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';

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
    const dog = data.dog;
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
