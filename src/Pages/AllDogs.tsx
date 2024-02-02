import { createContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { DogsContainer } from '../Components/DogsContainer';
import Search from '../Components/Search';
import { AxiosError } from 'axios';
import { useCurrentUser } from '../providers/useCurrentUser';

import { DogType } from '../Types';
import customFetch from '../utils/customFetch';

type TAllDogsProviderTypes = {
  setAllDogs: React.Dispatch<React.SetStateAction<DogType[]>>;
  allDogs: DogType[] | undefined;
  setSearchDogResults: React.Dispatch<React.SetStateAction<DogType[]>>;
  searchDogResults: DogType[] | undefined;
  setDogFilter: (dogId: string) => void;
  reFetchAllDogs: () => void;
};

export const AllDogsContext = createContext<TAllDogsProviderTypes>(
  {} as TAllDogsProviderTypes
);

export const AllDogs: React.FC<{ children: ReactNode }> = () => {
  const { user, setIsLoading } = useCurrentUser();
  const [allDogs, setAllDogs] = useState<DogType[]>([]);
  const [searchDogResults, setSearchDogResults] = useState<DogType[]>([]);

  const reFetchAllDogs = async () => {
    try {
      const fetchOneVetsDogs = await customFetch.get('/dogs');
      setAllDogs(fetchOneVetsDogs.data);
      setSearchDogResults(fetchOneVetsDogs.data);
      return fetchOneVetsDogs;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error?.response?.data?.msg);
      }
    }
  };

  useEffect(() => {
    const fetchAllDogs = async () => {
      try {
        const fetchOneVetsDogs = await customFetch.get('/dogs');
        setAllDogs(fetchOneVetsDogs.data);
        setSearchDogResults(fetchOneVetsDogs.data);
        setIsLoading(false);
      } catch (error) {
        toast.error("Error fetching user's dogs");
        return null;
      }
    };
    if (user) {
      fetchAllDogs();
    }
  }, [user]);

  const setDogFilter = (dogId: string) => {
    const filteredDogs = allDogs.filter((dog) => dog.id !== dogId);
    setAllDogs(filteredDogs);
  };

  return (
    <AllDogsContext.Provider
      value={{
        allDogs,
        setAllDogs,
        setDogFilter,
        searchDogResults,
        setSearchDogResults,
        reFetchAllDogs,
      }}
    >
      <Search />
      <DogsContainer />
    </AllDogsContext.Provider>
  );
};

export default AllDogs;


