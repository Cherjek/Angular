export interface ISupplierAddition {
  Id: number | null;
  IdTariffSupplier: number;
  Date: Date | string;
  OrderNumber: string;
  OrderDate: Date | string;
  Values: SupplierAdditionValue[];
}

export class SupplierAddition implements ISupplierAddition {
  Id: number;
  IdTariffSupplier: number;
  Date: string | Date;
  OrderNumber: string;
  OrderDate: Date | string;
  Values: SupplierAdditionValue[];
}

class SupplierAdditionValue {
  // MaxPowerType: TariffMaxPowerType;
  MaxPowerType: any;
  Value: number | null;
}
