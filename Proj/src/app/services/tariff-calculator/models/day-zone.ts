export interface IDayZone {
  Id: number | null;
  IdTariffOes: number;
  Date: Date | string;
  OrderDate: Date | string;
  OrderNumber: string;
  DayHours: number[];
  NightHours: number[];
}

export class DayZone implements IDayZone {
  Id: number;
  IdTariffOes: number;
  Date: string | Date;
  OrderDate: string | Date;
  OrderNumber: string;
  DayHours: number[];
  NightHours: number[];
}
