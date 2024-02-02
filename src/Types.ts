export type DogType = {
  id: string;
  vetId: string;
  sex: string;
  name: string;
  breed: string;
  birthDate: string;
  weight: number;
  dateVisited: string;
  notes: string;
  ownerName: string;
  isActive: boolean;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
};

export type DogsConditions = {
  id: string;
  dogId: string;
  conditionId: string;
};
export type Conditions = {
  id: string;
  conditionName: string;
};

export type AllUsers = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};
