import { createContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { DogsContainer } from '../Components/DogsContainer';
import Search from '../Components/Search';
import axios from 'axios';
import { useCurrentUser } from '../providers/useCurrentUser';

import { DogType } from '../Types';

type TAllDogsProviderTypes = {
  setAllDogs: React.Dispatch<React.SetStateAction<DogType[]>>;
  allDogs: DogType[] | undefined;
  setSearchResults: React.Dispatch<React.SetStateAction<DogType[]>>;
  searchResults: DogType[] | undefined;
  removeDog: (dogId: number) => void;
  reFetchAllDogs: (id: number) => void;
};

export const AllDogsContext = createContext<TAllDogsProviderTypes>(
  {} as TAllDogsProviderTypes
);

export const AllDogs: React.FC<{ children: ReactNode }> = () => {
  /*  const { data } = useLoaderData(); */
  const { user } = useCurrentUser();
  const [allDogs, setAllDogs] = useState<DogType[]>([]);
  const [searchResults, setSearchResults] = useState<DogType[]>([]);

  const reFetchAllDogs = async (id: number) => {
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
    if (user) {
      fetchAllDogs(user.id);
    }
  }, []);

  const removeDog = (dogId: number) => {
    // Filter out the dog with the specified ID from the current list of dogs
    const updatedDogs = allDogs.filter((dog) => dog.id !== dogId);
    setAllDogs(updatedDogs);
  };

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

export default AllDogs;
