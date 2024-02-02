import Wrapper from '../assets/Wrappers/DogsContainer';
import { Users } from '../Components/Users';
import { AllUsers } from '../Types';

export const UsersContainer = ({
  allUsers,
}: {
  allUsers: AllUsers[] | null;
}) => {
  if (!allUsers) {
    return (
      <Wrapper>
        <h2>No users to display</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="dogs">
        {allUsers?.map((user) => (
          <Users key={user.email} {...user} />
        ))}
      </div>
    </Wrapper>
  );
};
