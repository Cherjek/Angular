export interface IPeakHour {
  Id: number | null;
  IdTariffPriceZone: number;
  Date: Date | string;
  PeakHours: number[];
}

export class PeakHour implements IPeakHour {
  Id: number;
  IdTariffPriceZone: number;
  Date: string | Date;
  PeakHours: number[];
}
