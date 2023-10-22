import Wrapper from '../assets/Wrappers/DogInfo';

export const DogInfo = ({ icon, text }: { icon: string; text: string }) => {
  return (
    <Wrapper>
      <span className="dog-icon">{icon}</span>
      <span className="dog-text">{text}</span>
    </Wrapper>
  );
};
