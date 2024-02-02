import Wrapper from '../assets/Wrappers/BigSidebar';
import Logo from './Logo';
import NavLinks from './NavLinks';
import { useDashboardContext } from '../providers/useDashboardContext';

export const BigSidebar = () => {
  const { showSidebar } = useDashboardContext();
  return (
    <Wrapper>
      <div
        className={
          showSidebar ? 'sidebar-container ' : 'sidebar-container show-sidebar'
        }
      >
        <div className="content">
          <header>
            <Logo />
          </header>
          <NavLinks isBigSidebar={true} />
        </div>
      </div>
    </Wrapper>
  );
};
