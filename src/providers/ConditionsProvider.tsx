import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Conditions } from "../Types";
import { getConditions } from "../api";
import { useCurrentUser } from "./CurrentUserProvider";

type TConditionsProvider = {
  conditions: Conditions[] | null;
  setConditions: React.Dispatch<React.SetStateAction<Conditions[] | null>>;
  refetchConditions: () => void;
};

const ConditionsContext = createContext<TConditionsProvider>(
  {} as TConditionsProvider
);

export const ConditionsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [conditions, setConditions] = useState<Conditions[] | null>(null);
  const { user } = useCurrentUser();

  const refetchConditions = async () => {
    try {
      const conditionsData = await getConditions();
      setConditions(conditionsData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchConditions = async () => {
      refetchConditions();
    };
    fetchConditions();
  }, [user]);
  console.log("conditions from context", conditions);
  return (
    <ConditionsContext.Provider
      value={{ conditions, setConditions, refetchConditions }}
    >
      {children}
    </ConditionsContext.Provider>
  );
};
export const useConditions = () => useContext(ConditionsContext);
