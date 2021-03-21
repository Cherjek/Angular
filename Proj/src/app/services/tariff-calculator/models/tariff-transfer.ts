import { SupplyOrganizationType } from './supply-organization-type';
import { TariffTransferRate } from './tariff-transfer-rate';

export interface ITariffTransfer {
  Id: number | null;
  IdTariffRegion: number;
  Date: Date | string;
  OrderDate: Date | string;
  OrderNumber: string;
  OneRate: TariffTransferRate[];
  TwoRatesUpkeep: TariffTransferRate[];
  TwoRatesConsumption: TariffTransferRate[];
  SupplyOrganizationType: SupplyOrganizationType;
}

export class TariffTransfer implements ITariffTransfer {
  Id: number;
  IdTariffRegion: number;
  Date: string | Date;
  OrderDate: string | Date;
  OrderNumber: string;
  OneRate: TariffTransferRate[];
  TwoRatesUpkeep: TariffTransferRate[];
  TwoRatesConsumption: TariffTransferRate[];
  SupplyOrganizationType: SupplyOrganizationType;
}
