import { DateTimeRange } from 'src/app/services/common/Models/DateTimeRange';
import { ExportFileFormats } from './ExportFileFormats';
import { ExportImportSettingType } from './ExportImportSettingType';

export class DatabaseTariffExportSettings {
  DateTimeRange: DateTimeRange;
  SettingTypes: ExportImportSettingType[];
  IdTariffSuppliers: number[];
  FileFormat: ExportFileFormats;
}