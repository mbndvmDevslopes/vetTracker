import { FormRow } from './FormRow';
import Wrapper from '../assets/Wrappers/DashboardFormPage';
import { Form } from 'react-router-dom';

import { DogType } from '../Types';
import { useAllDogsContext } from '../providers/useAllDogs';

const Search = () => {
  const { setSearchDogResults, allDogs } = useAllDogsContext();

  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const searchTerm = e.target.value.toLowerCase();

    if (!e.target.value) return setSearchDogResults(allDogs as DogType[]);
    const filteredDogs = allDogs?.filter(
      (dog: DogType) =>
        dog.name.toLowerCase().includes(searchTerm) ||
        dog.sex.toLowerCase().includes(searchTerm) ||
        dog.breed.toLowerCase().includes(searchTerm) ||
        dog.ownerName.toLowerCase().includes(searchTerm)
    );
    setSearchDogResults(filteredDogs as DogType[]);
  };

  return (
    <Wrapper>
      <Form className="form">
        <div className="form-center search">
          <FormRow
            type="search"
            name="search"
            defaultValue=""
            onChange={handleSearch}
            labelText=""
          />
        </div>
      </Form>
    </Wrapper>
  );
};

export default Search;
