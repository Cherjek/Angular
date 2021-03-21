export interface IAddressBook {
  Id: number;
  Name: string;
  EMail: string;
  PhoneNumber: string;
}

export class AddressBook implements IAddressBook {
  Id: number;
  Name: string;
  EMail: string;
  PhoneNumber: string;
}
