
import Wrapper from '../assets/Wrappers/DogsContainer';

import { useConditions } from '../providers/useConditions';
import { Condition } from './Condition';
import { Conditions  } from '../Types';


export const ConditionsContainer = ({searchResults}: {searchResults: Conditions[]}) => {


   const { conditions } = useConditions(); 

  if (conditions?.length === 0) {
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