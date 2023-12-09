import { useDashboardContext } from '../providers/useDashboardContext';
import { useCurrentUser } from '../providers/useCurrentUser';
import { links } from '../utils/links';
import { NavLink } from 'react-router-dom';

function NavLinks({ isBigSidebar }: { isBigSidebar?: boolean }) {
  const { toggleSidebar } = useDashboardContext();
  const { user } = useCurrentUser();
  if (!user) {
    // You can render a loading state or simply return null if user is not available yet
    return null;
  }
  return (
    <div className="nav-links">
      <h4>{`Dr. ${user?.lastName}`}</h4>
      {links.map((link) => (
        <NavLink
          to={link.path}
          key={link.text}
          className="nav-link"
          onClick={isBigSidebar ? undefined : toggleSidebar}
          end
        >
          <span className="icon">{link.icon}</span> {link.text}
        </NavLink>
      ))}
    </div>
  );
}

export default NavLinks;
