import { ConditionsContainer } from '../Components/ConditionsContainer';
import SearchConditions from '../Components/SearchConditions';
import { Conditions } from '../Types';
import { Link } from 'react-router-dom';
import { useDashboardContext } from '../providers/useDashboardContext';
import { useEffect } from 'react';

type AllConditionsProps = {
  searchResults: Conditions[];
  setSearchResults: React.Dispatch<React.SetStateAction<Conditions[]>>;
};

export const AllConditions: React.FC<AllConditionsProps> = ({
  searchResults,
  setSearchResults,
}) => {
  const { conditions } = useDashboardContext();
  useEffect(() => {
    if (conditions !== null) setSearchResults(conditions);
  }, [conditions]);
  return (
    <>
      <h2 className="conditions-title">Conditions</h2>
      <Link to={`../add-condition`} className="btn edit-btn add-condition">
        Add Condition
      </Link>
      <SearchConditions setSearchResults={setSearchResults} />

      <ConditionsContainer searchResults={searchResults} />
    </>
  );
};
