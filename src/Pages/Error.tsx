import { useRouteError, Link } from 'react-router-dom';
import Wrapper from '../assets/Wrappers/Error';
import image from '../assets/images/404-error-with-landscape-concept-illustration_114360-7898.avif';

type ErrorObject = {
  status?: number;
};

const Error = () => {
  const error: { status?: number } = useRouteError() as ErrorObject;
  if (error.status === 404) {
    return (
      <Wrapper>
        <div>
          <img src={image} alt="404 error image" />
          <h3>Page not found</h3>
          <p>We can't seem to find the page you're looking for</p>
          <Link to="/dashboard">Dashboard</Link>
        </div>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <h1>something went wrong</h1>
    </Wrapper>
  );
};

export default Error;
