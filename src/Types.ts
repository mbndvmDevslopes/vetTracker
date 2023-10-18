export type DogType = {
  id: number;
  vetId: number;
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
  id: number;
  name: string;
  lastName: string;
  email: string;
  password: string;
};

export type DogsConditions = {
  id: number;
  dogId: number;
  conditionId: number;
};
export type Conditions = {
  id: number;
  conditionName: string;
  isActive: boolean;
};
