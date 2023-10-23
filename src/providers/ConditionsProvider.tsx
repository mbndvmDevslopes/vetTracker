import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Conditions } from '../Types';
import { getConditions } from '../api';
import { useCurrentUser } from './useCurrentUser';

type TConditionsProvider = {
  conditions: Conditions[] | null;
  setConditions: React.Dispatch<React.SetStateAction<Conditions[] | null>>;
  refetchConditions: () => void;
};

export const ConditionsContext = createContext<TConditionsProvider>(
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
  return (
    <ConditionsContext.Provider
      value={{ conditions, setConditions, refetchConditions }}
    >
      {children}
    </ConditionsContext.Provider>
  );
};
