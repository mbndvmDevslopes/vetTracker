import { useEffect } from 'react';
import { Form } from 'react-router-dom';
import { FormRow } from './FormRow';
import Wrapper from '../assets/Wrappers/DashboardFormPage';

import { Conditions } from '../Types';
import { useDashboardContext } from '../providers/useDashboardContext';

const Search: React.FC<{
  setSearchResults: React.Dispatch<React.SetStateAction<Conditions[]>>;
}> = ({ setSearchResults }) => {
  const { conditions } = useDashboardContext();
  useEffect(() => {
    setSearchResults(conditions as Conditions[]);
  }, []);
  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const searchTerm = e.target.value.toLowerCase();

    if (!e.target.value) return setSearchResults(conditions as Conditions[]);

    const filteredConditions = conditions?.filter((condition: Conditions) =>
      condition.conditionName.toLowerCase().includes(searchTerm)
    );
    setSearchResults(filteredConditions as Conditions[]);
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
