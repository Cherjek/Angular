import { IOES } from './oes';
import { IPriceZone } from './price-zone';
import { ITimeZone } from './time-zone';

export interface IRegion {
  Id: number;
  Code: string;
  Name: string;
  TimeZone: ITimeZone;
  AtsTimeZone: ITimeZone;
  PriceZone?: IPriceZone;
  Oes?: IOES;
}

export class Region implements IRegion {
  Id: number;
  Code: string;
  Name: string;
  TimeZone: ITimeZone;
  AtsTimeZone: ITimeZone;
  PriceZone?: IPriceZone;
  Oes?: IOES;
}
