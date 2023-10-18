import { useRouteError } from 'react-router-dom';

export const Error = () => {
  const error = useRouteError();
  console.log(error);
  return <h4>There was an error.......</h4>;
};
