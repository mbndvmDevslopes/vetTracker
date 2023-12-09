import axios from 'axios';

const customFetch = axios.create({
  /*  baseURL: 'http://localhost:5100', */
  baseURL: '/api/',
});

export default customFetch;
