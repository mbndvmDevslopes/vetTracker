import Wrapper from '../assets/Wrappers/DogsContainer';

import { Condition } from './Condition';
import { Conditions } from '../Types';
import { useEffect } from 'react';

export const ConditionsContainer = ({
  searchResults,
}: {
  searchResults: Conditions[];
}) => {
  useEffect(() => {}, [searchResults]);
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
        {searchResults?.map((condition) => (
          <Condition key={condition.id} {...condition} />
        ))}
      </div>
    </Wrapper>
  );
};
