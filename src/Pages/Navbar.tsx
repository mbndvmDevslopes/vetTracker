import Wrapper from '../assets/Wrappers/Navbar';
import { AiOutlineMenu } from 'react-icons/ai';
import Logo from '../Components/Logo';
import { useDashboardContext } from '../providers/useDashboardContext';
import { LogoutContainer } from '../Components/LogoutContainer';
import { ThemeToggle } from '../Components/ThemeToggle';

export const Navbar = () => {
  const { toggleSidebar } = useDashboardContext();
  return (
    <Wrapper>
      <div className="nav-center">
        <button type="button" className="toggle-btn">
          <AiOutlineMenu onClick={toggleSidebar} />
        </button>
        <div>
          <Logo />
          <h4 className="logo-text">dashboard</h4>
        </div>
        <div className="btn-container">
          <ThemeToggle />
          <LogoutContainer />
        </div>
      </div>
    </Wrapper>
  );
};
