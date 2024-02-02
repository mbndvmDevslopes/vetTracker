import Wrapper from '../assets/Wrappers/User';

export const Users = ({
  firstName,
  lastName,
  email,
  role,
}: {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}) => {
  return (
    <Wrapper>
      <header>
        <div className="info">
          <h5>
            User: {firstName} {lastName}
          </h5>
          <h5>Access: {role}</h5>
          <h5>email: {email}</h5>
        </div>
      </header>
      <div>
        <footer className="actions"></footer>
      </div>
    </Wrapper>
  );
};
