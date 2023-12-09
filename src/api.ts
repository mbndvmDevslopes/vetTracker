import axios from 'axios';
import customFetch from './utils/customFetch';

const API_URL = 'http://localhost:3000';
/* export const fetchOneVetsDogs = await customFetch.get('/dogs');
export const fetchAllConditions = await customFetch.get('/conditions'); */


export const getUserData = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};
export const getUser = async (email: string) => {
  try {
    const response = await axios.get(`${API_URL}/users?email=${email}`);

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

export const getConditions = async () => {
  try {
    const response = await axios.get(`${API_URL}/conditions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching conditions:', error);
    throw error;
  }
};

export const getDogs = async () => {
  try {
    const response = await axios.get(`${API_URL}/dogs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dogs:', error);
    throw error;
  }
};
