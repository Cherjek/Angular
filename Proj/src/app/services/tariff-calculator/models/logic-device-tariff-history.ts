import { IAgreementType } from './agreement-type';
import { IMaximumPower } from './maximum-power';
import { PowerLevel } from './power-level';
import { ISupplyOrganizationType } from './supply-organization-type';

export interface ILogicDeviceTariffHistory {
  Id: number | null;
  IdLogicDevice: number;
  StartDate: Date | string;
  Supplier: any;
  MaxPowerType: IMaximumPower;
  AgreementType: IAgreementType;
  PriceCategoryType: any;
  PowerLevelType: PowerLevel;
  SupplyOrganizationType: ISupplyOrganizationType;
  IsGenerator: boolean;
}

export class LogicDeviceTariffHistory implements ILogicDeviceTariffHistory {
  Id: number;
  IdLogicDevice: number;
  StartDate: string | Date;
  Supplier: any;
  MaxPowerType: IMaximumPower;
  AgreementType: IAgreementType;
  PriceCategoryType: any;
  PowerLevelType: PowerLevel;
  SupplyOrganizationType: ISupplyOrganizationType;
  IsGenerator: boolean;
}
