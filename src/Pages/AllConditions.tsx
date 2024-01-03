import { ConditionsContainer } from '../Components/ConditionsContainer';
import { useConditions } from '../providers/useConditions';
import SearchConditions from '../Components/SearchConditions';
import { Conditions } from '../Types';
import { useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useDashboardContext } from '../providers/useDashboardContext';
import { requireAuth } from '../utils/requireAuth';
import customFetch from '../utils/customFetch';

type AllConditionsProps = {
  searchResults: Conditions[];
  setSearchResults: React.Dispatch<React.SetStateAction<Conditions[]>>;
};

export const AllConditions: React.FC<AllConditionsProps> = ({
  searchResults,
  setSearchResults,
}) => {
  /* const { conditions } = useConditions(); */
  const { conditions, refetchConditions, setConditions } =
    useDashboardContext();
  /*  const [searchResults, setSearchResults] = useState<Conditions[]>([]); */

  useEffect(() => {
    const updateConditions = async () => {
      try {
        const fetchUpdatedConditions = await customFetch.get('/conditions');

        setConditions((prevConditions) => fetchUpdatedConditions.data);
        setSearchResults((prevResults) => fetchUpdatedConditions.data);
      } catch (error) {
        console.log(error);
        return null;
      }
    };
    updateConditions();
  }, [setConditions, setSearchResults]);
  /*  useEffect(() => {
    const fetchData = async () => {
      await refetchConditions();
      setSearchResults(refetchConditions());
    };

    fetchData();
  }, [setSearchResults, refetchConditions]); */
  return (
    <>
      <h2 className="conditions-title">Conditions</h2>
      <Link to={`../add-condition`} className="btn edit-btn add-condition">
        Add Condition
      </Link>
      <SearchConditions setSearchResults={setSearchResults} />

      {/* <ConditionsContainer searchResults={searchResults} setSearchResults ={setSearchResults} /> */}
      <ConditionsContainer searchResults={searchResults} />
    </>
  );
};
