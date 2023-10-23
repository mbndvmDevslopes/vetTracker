import Wrapper from '../assets/Wrappers/Landing';
import Logo from '../Components/Logo';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            vet <span>tracker </span>app
          </h1>
          <p>Tracking patients and conditions has never been easier!</p>
          <Link to="/register" className="btn register-link">
            Register
          </Link>
          <Link to="/login" className="btn ">
            Login
          </Link>
        </div>
      </div>
    </Wrapper>
  );
};

export default Landing;
