export interface ImportExportResult {
  IsExport: boolean;
  ExportSettings: ExportSettings;
  ImportSettings?: any;
  Files?: any;
  Id: number;
  CorrelationId: string;
  Name: string;
  CreateDate: string;
  StartDate: string;
  UpdateDate: string;
  FinishDate: string;
  State: State;
  Progress: number;
  DirectorInstance: string;
  ExecutorInstance: string;
  User: User;
  TaskType: number;
}

interface User {
  Id: number;
  IsBlocked: boolean;
  Login: string;
  Name: string;
  PhoneNumber: string;
  Email: string;
  CreationDate: string;
  IdAuthenticityType: string;
}

interface State {
  Id: number;
  Code: string;
  Name: string;
}

interface ExportSettings {
  DateTimeRange: DateTimeRange;
  SettingTypes: SettingType[];
  TariffSuppliers: TariffSupplier[];
  FileFormat: number;
}

interface TariffSupplier {
  Id: number;
  Code: string;
  Name: string;
  Region?: any;
  NonPriceZone: boolean;
  Disabled: boolean;
}

interface SettingType {
  Code: string;
  Name: string;
}

interface DateTimeRange {
  Start: string;
  End: string;
  RangeType: number;
}