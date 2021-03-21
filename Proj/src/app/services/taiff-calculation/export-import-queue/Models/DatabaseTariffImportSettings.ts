import { DateTimeRange } from 'src/app/services/common/Models/DateTimeRange';
import { ExportImportSettingType } from './ExportImportSettingType';
import { TariffImportSettingsTypes } from './TariffImportSettingsTypes';

export class DatabaseTariffImportSettings {
  DateTimeRange: DateTimeRange;
  SettingTypes: ExportImportSettingType[];
  IdTariffSuppliers: number[];
  ImportType: TariffImportSettingsTypes;
}