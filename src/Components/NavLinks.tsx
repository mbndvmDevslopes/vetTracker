import { useDashboardContext } from "../Pages/DashboardLayout";
import { useCurrentUser } from "../providers/CurrentUserProvider";
import { links } from "../utils/links";
import { NavLink } from "react-router-dom";

type NavLInksProps = {
  isBigSidebar: boolean;
};
function NavLinks({ isBigSidebar }: NavLInksProps) {
  const { toggleSidebar } = useDashboardContext();
  const { user } = useCurrentUser();

  const handleClick = () => {
    isBigSidebar ? null : toggleSidebar;
  };
  return (
    <div className="nav-links">
      <h4>{`Dr. ${user?.lastName}`}</h4>
      {links.map((link) => (
        <NavLink
          to={link.path}
          key={link.text}
          className="nav-link"
          onClick={handleClick}
        >
          <span className="icon">{link.icon}</span> {link.text}
        </NavLink>
      ))}
    </div>
  );
}

export default NavLinks;
