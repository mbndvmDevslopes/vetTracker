import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Conditions } from '../Types';
import { useCurrentUser } from './useCurrentUser';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';

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
      const fetchAllConditions = await customFetch.get('/conditions');
      setConditions(fetchAllConditions.data);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error?.response?.data?.msg);
      }
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
