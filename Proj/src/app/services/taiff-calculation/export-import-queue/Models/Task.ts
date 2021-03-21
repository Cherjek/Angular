import { DatabaseTariffExportSettings } from './DatabaseTariffExportSettings';
import { DatabaseTariffImportSettings } from './DatabaseTariffImportSettings';
import { File } from './File';

export class Task {
  Id?: number;
  IsExport?: boolean;
  Name?: string;
  ExportSettings?: DatabaseTariffExportSettings;
  ImportSettings?: DatabaseTariffImportSettings;
  Files?: File[];
}