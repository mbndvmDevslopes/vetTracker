import { useContext, createContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { DogsContainer } from '../Components/DogsContainer';
import Search from '../Components/Search';
import { useLoaderData, useOutletContext } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import axios from 'axios';
import { useCurrentUser } from '../providers/useCurrentUser';

import { User, DogType } from '../Types';

/* export const loader = async ({request}: {request: Request}) => {
  try {
   

    const { id } = user;
  
    if (!id) {
      throw new Error('User ID not found in local storage');
    }
    const { data } = await axios.get(`http://localhost:3000/dogs?vetId=${id}`, params);
    
    console.log(data);
    return { data };
  } catch (error) {
    toast.error('Error fetching all dogs:');
    return null;
  }
}; */
type TAllDogsProviderTypes = {
  setAllDogs: React.Dispatch<React.SetStateAction<DogType[]>>;
  allDogs: DogType[] | undefined;
  setSearchResults: React.Dispatch<React.SetStateAction<DogType[]>>;
  searchResults: DogType[] | undefined;
  removeDog: (dogId: number) => void;
  reFetchAllDogs: (id:number) => void;
};


const AllDogsContext = createContext<TAllDogsProviderTypes>({} as TAllDogsProviderTypes);

export const AllDogs: React.FC<{ children: ReactNode }> = () => {
  /*  const { data } = useLoaderData(); */
  const { user } = useCurrentUser();
  const [allDogs, setAllDogs] = useState<DogType[]>([]);
  const [searchResults, setSearchResults] = useState<DogType[]>([]);

  const reFetchAllDogs = async (id:number) => {
    

    try {
      const { data } = await axios.get(
        `http://localhost:3000/dogs?vetId=${id}`
      );
      setAllDogs(data);
      setSearchResults(data);
    } catch (error) {
      toast.error('Error fetching all dogs:');
      return null;
    }
  };

  useEffect(() => {
    const fetchAllDogs = async (id: number) => {
      

      try {
        const { data } = await axios.get(
          `http://localhost:3000/dogs?vetId=${id}`
        );
        setAllDogs(data);
        setSearchResults(data);
      } catch (error) {
        toast.error('Error fetching all dogs:');
        return null;
      }
    };
    fetchAllDogs(user.id);
  }, []);

  const removeDog = (dogId:number) => {
    // Filter out the dog with the specified ID from the current list of dogs
    const updatedDogs = allDogs.filter((dog) => dog.id !== dogId);
    setAllDogs(updatedDogs);
  };
  /* 
  const [allDogs, setDogs] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:3000/dogs?vetId=${userData.id}`)
      .then((response) => {
        setDogs(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching dogs:', error);
      });
  }, []); */
  return (
    <AllDogsContext.Provider
      value={{
        allDogs,
        setAllDogs,
        removeDog,
        searchResults,
        setSearchResults,
        reFetchAllDogs,
      }}
    >
      <Search />
      <DogsContainer />
    </AllDogsContext.Provider>
  );
};

export const useAllDogsContext = () => useContext(AllDogsContext);

export default AllDogs;
