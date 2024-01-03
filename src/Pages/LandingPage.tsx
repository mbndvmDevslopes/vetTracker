import Wrapper from '../assets/Wrappers/Landing';
import Logo from '../Components/Logo';
import { Link } from 'react-router-dom';
import main from '../assets/images/toby.png';

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
        <img src={main} alt="main image" className="img main-img" />
      </div>
    </Wrapper>
  );
};

export default Landing;
