import { ConditionsContainer } from "../Components/ConditionsContainer";
import { useConditions } from "../providers/ConditionsProvider";
import SearchConditions from "../Components/SearchConditions";
import { Conditions } from "../Types";
import { useEffect} from "react";
import { Link } from "react-router-dom";

type AllConditionsProps = {
  searchResults: Conditions[];
  setSearchResults: React.Dispatch<React.SetStateAction<Conditions[]>>;
};

export const AllConditions: React.FC<AllConditionsProps> = ({
  searchResults,
  setSearchResults,
}) => {
  const { conditions } = useConditions();
  /* const [searchResults, setSearchResults] = useState<Conditions[]>([]); */

  useEffect(() => {
    if (conditions !== null) {
      setSearchResults(conditions);
    }
  }, [conditions]);

  return (
    <>
      <h2 className="conditions-title">Conditions</h2>
      <Link to={`../add-condition`} className="btn edit-btn">
        Add Condition
      </Link>
      <SearchConditions setSearchResults={setSearchResults} />

      <ConditionsContainer searchResults={searchResults} />
    </>
  );
};
