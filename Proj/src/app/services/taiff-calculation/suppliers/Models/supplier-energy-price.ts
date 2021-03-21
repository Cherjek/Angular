export interface ISupplierEnergyPrice {
  Id: number;
  IdTariffSupplier: number;
  Date: string | Date;
  RetailCost?: any;
  Pc1AvgCost?: any;
  NightZoneCost?: any;
  DayZoneCost?: any;
  HalfPeakZoneCost?: any;
  PeakZoneCost?: any;
  PowerAvgCost?: any;
  ProposalDiffCost?: any;
  ProposalDiffBalanceCost?: any;
}

export class SupplierEnergyPrice implements ISupplierEnergyPrice {
  Id: number;
  IdTariffSupplier: number;
  Date: string | Date;
  RetailCost?: any;
  Pc1AvgCost?: any;
  NightZoneCost?: any;
  DayZoneCost?: any;
  HalfPeakZoneCost?: any;
  PeakZoneCost?: any;
  PowerAvgCost?: any;
  ProposalDiffCost?: any;
  ProposalDiffBalanceCost?: any;
}
