import Wrapper from '../assets/Wrappers/DogsContainer';

import { useConditions } from '../providers/useConditions';
import { Condition } from './Condition';
import { Conditions } from '../Types';
import { useOutletContext } from 'react-router-dom';
import { useDashboardContext } from '../providers/useDashboardContext';
import { useEffect } from 'react';

export const ConditionsContainer = ({
  searchResults,
}: {
  searchResults: Conditions[];
}) => {
  /*  const { conditions } = useConditions(); 
  const { conditions } = useDashboardContext();*/

  /*   if (conditions?.length === 0) { */
  useEffect(() => {
    console.log('Received searchResults:', searchResults);
  }, [searchResults]);
  if (searchResults?.length === 0) {
    return (
      <Wrapper>
        <h2>No conditions to display</h2>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <div className="dogs">
        {/* {conditions?.map((condition) => ( */}

        {searchResults?.map((condition) => (
          <Condition key={condition.id} {...condition} />
        ))}
      </div>
    </Wrapper>
  );
};
