//import { useEffect } from 'react';
import { Form } from 'react-router-dom';
import { FormRow } from './FormRow';
import Wrapper from '../assets/Wrappers/DashboardFormPage';

import { Conditions } from '../Types';
import { useDashboardContext } from '../providers/useDashboardContext';

const Search: React.FC<{
  setSearchResults: React.Dispatch<React.SetStateAction<Conditions[]>>;
}> = ({ setSearchResults }) => {
  const { conditions } = useDashboardContext();

  /*   useEffect(() => {
    setSearchResults(conditions as Conditions[]);
  }, []); */

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

/*  
ertainly! Another approach is to add a searchTerm state to track changes in the search input and then use it in the useEffect to filter the conditions. This way, you can control when to update the searchResults more explicitly. Here's an example:

tsx

import { useState, useEffect } from 'react';
// ... other imports

export const AllConditions: React.FC<AllConditionsProps> = ({
  // ... other props
}) => {
  const { conditions } = useDashboardContext();
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    // Filter conditions based on the search term
    const filteredConditions = conditions?.filter((condition: Conditions) =>
      condition.conditionName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Update searchResults
    setSearchResults(filteredConditions as Conditions[]);
  }, [conditions, searchTerm, setSearchResults]);

  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
  };

  return (
    <>
    
      <SearchConditions setSearchResults={setSearchResults} onSearch={handleSearch} />
      <ConditionsContainer searchResults={searchResults} />
    </>
  );
};

And in SearchConditions.tsx:

tsx

const Search: React.FC<{
  setSearchResults: React.Dispatch<React.SetStateAction<Conditions[]>>;
  onSearch: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}> = ({ setSearchResults, onSearch }) => {
  return (
    <Wrapper>
      <Form className="form">
        <div className="form-center search">
          <FormRow
            type="search"
            name="search"
            defaultValue=""
            onChange={onSearch} {/* Use the provided onSearch function 
            labelText=""
          />
        </div>
      </Form>
    </Wrapper>
  );
};
*/
