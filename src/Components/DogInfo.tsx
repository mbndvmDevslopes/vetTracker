import Wrapper from '../assets/Wrappers/DogInfo';

export const DogInfo = ({ icon, text }) => {
  return (
    <Wrapper>
      <span className="dog-icon">{icon}</span>
      <span className="dog-text">{text}</span>
    </Wrapper>
  );
};
