import { useContext } from "react";
import { CurrentUserContext } from "./CurrentUserProvider";

export const useCurrentUser = () => useContext(CurrentUserContext);