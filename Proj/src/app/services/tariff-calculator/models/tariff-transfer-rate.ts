import { PowerLevel } from './power-level';
export interface ITariffTransferRate {
  PowerLevelType: PowerLevel;
  Value: number;
}

export class TariffTransferRate implements ITariffTransferRate {
  PowerLevelType: PowerLevel;
  Value: number;
}
