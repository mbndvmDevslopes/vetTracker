import { createContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { DogsContainer } from '../Components/DogsContainer';
import Search from '../Components/Search';
import { AxiosError } from 'axios';
import { useCurrentUser } from '../providers/useCurrentUser';

import { DogType } from '../Types';
import customFetch from '../utils/customFetch';
import dayjs from 'dayjs';

type TAllDogsProviderTypes = {
  setAllDogs: React.Dispatch<React.SetStateAction<DogType[]>>;
  allDogs: DogType[] | undefined;
  setSearchResults: React.Dispatch<React.SetStateAction<DogType[]>>;
  searchResults: DogType[] | undefined;
  setDogFilter: (dogId: string) => void;
  /* reFetchAllDogs: (id: string) => void; */
  reFetchAllDogs: () => void;
};

export const AllDogsContext = createContext<TAllDogsProviderTypes>(
  {} as TAllDogsProviderTypes
);

export const AllDogs: React.FC<{ children: ReactNode }> = () => {
  /*  const { data } = useLoaderData(); */
  const { user, setIsLoading } = useCurrentUser();
  const [allDogs, setAllDogs] = useState<DogType[]>([]);
  const [searchResults, setSearchResults] = useState<DogType[]>([]);

  /* const formatDates = (date: string) => {
    return date.format('MM-DD-YYYY');
  }; */
  const reFetchAllDogs = async () => {
    try {
      const fetchOneVetsDogs = await customFetch.get('/dogs');
      console.log('fetchonvets dogs data', fetchOneVetsDogs.data);
      const dogs = fetchOneVetsDogs.data;
      console.log('day visited', dogs[0].dateVisited);
      setAllDogs(fetchOneVetsDogs.data);
      setSearchResults(fetchOneVetsDogs.data);
      console.log('type of date', typeof fetchOneVetsDogs.data.dateVisited);
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
        setSearchResults(fetchOneVetsDogs.data);
        setIsLoading(false);
        console.log('day visited', fetchOneVetsDogs.data[0].dateVisited);
        console.log(
          'type of date',
          typeof fetchOneVetsDogs.data[0].dateVisited
        );
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
    // Filter out the dog with the specified ID from the current list of dogs
    const filteredDogs = allDogs.filter((dog) => dog.id !== dogId);
    setAllDogs(filteredDogs);
  };

  return (
    <AllDogsContext.Provider
      value={{
        allDogs,
        setAllDogs,
        setDogFilter,
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
function setIsLoading(arg0: boolean) {
  throw new Error('Function not implemented.');
}

