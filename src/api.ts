import axios from 'axios';

const API_URL = 'http://localhost:3000'; 

export const getUserData = async (userId: number) => {
  try {
    /*    const response = await axios.get(`${API_URL}/veterinarians/${userId}`); */
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
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
}

export const getDogs = async () => {
  try { 
    const response =await axios.get(`${API_URL}/dogs`);
    return response.data;

} catch(error) {
  console.error('Error fetching dogs:', error);
  throw error;
}
}
