export type DogType = {
  id: string;
  vetId: string;
  sex: string;
  name: string;
  breed: string;
  birthDate: Date;
  weight: number;
  dateVisited: Date;
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
};

export type DogsConditions = {
  id: string;
  dogId: number;
  conditionId: number;
};
export type Conditions = {
  id: string;
  conditionName: string;
};
