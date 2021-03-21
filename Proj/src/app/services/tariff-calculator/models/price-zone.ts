export interface IPriceZone {
  Id: number;
  Code: string;
  Name: string;
}

export class PriceZone implements IPriceZone {
  Id: number;
  Code: string;
  Name: string;
}
