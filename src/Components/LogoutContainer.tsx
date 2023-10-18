import { useState } from "react";
import { FaUserCircle, FaCaretDown } from "react-icons/fa";
import Wrapper from "../assets/Wrappers/LogoutContainer";
import { useDashboardContext } from "../Pages/DashboardLayout";
import { useCurrentUser } from "../providers/CurrentUserProvider";

export const LogoutContainer = () => {
  const [showLogout, setShowLogout] = useState(false);
  const { logoutUser } = useDashboardContext();
  const { user } = useCurrentUser();
  return (
    <Wrapper>
      <button
        className="btn logout-btn"
        onClick={() => setShowLogout(!showLogout)}
      >
        <FaUserCircle />
        {`Dr. ${user?.lastName}`}
        <FaCaretDown />
      </button>
      <div className={showLogout ? "dropdown show-dropdown" : "dropdown "}>
        <button className="dropdown-btn" onClick={logoutUser}>
          logout
        </button>
      </div>
    </Wrapper>
  );
};
