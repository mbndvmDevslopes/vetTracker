import { Form } from "react-router-dom";
import { FormRow } from "./FormRow";
import Wrapper from "../assets/Wrappers/DashboardFormPage";

import { Conditions } from "../Types";
import { useConditions } from "../providers/useConditions";

const Search: React.FC<{
  setSearchResults: React.Dispatch<React.SetStateAction<Conditions[]>>;
}> = ({ setSearchResults }) => {
  const { conditions } = useConditions();

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
        <h5 className="form-title">search form</h5>
        <div className="form-center search">
          <FormRow
            type="search"
            name="search"
            defaultValue=""
            onChange={handleSearch}
            labelText="Search"
          />
        </div>
      </Form>
    </Wrapper>
  );
};

export default Search;
