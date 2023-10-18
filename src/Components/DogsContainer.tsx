import { Dog } from './Dog';
import Wrapper from '../assets/Wrappers/DogsContainer';
import { useAllDogsContext } from '../Pages/AllDogs';

export const DogsContainer = () => {
  const { allDogs, searchResults } = useAllDogsContext();


  if (allDogs?.length === 0) {
    return (
      <Wrapper>
        <h2>No dogs to display</h2>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <div className="dogs">
        {/* {allDogs.map((dog) => ( */}
        {searchResults?.map((dog) => (
          <Dog key={dog.id} {...dog} />
        ))}
      </div>
    </Wrapper>
  );
};
