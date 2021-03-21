import { IData } from './../../data-query/Models/Data';
export interface ICustomer {
  Id: number;
  Application: {
    Id: number;
    Name: string;
  };
  Surname: string;
  FirstName: string;
  MiddleName: null;
  PhoneNumber: string;
  Email: string;
  Address: string;
  Comment: string;
  Status: IData;
  Password: string;
}

export class Customer implements ICustomer {
  Id: number;
  Application: { Id: number; Name: string };
  Surname: string;
  FirstName: string;
  MiddleName: null;
  PhoneNumber: string;
  Email: string;
  Address: string;
  Comment: string;
  Status: IData;
  Password: string;
}
