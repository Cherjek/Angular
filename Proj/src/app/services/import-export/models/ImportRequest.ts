import { ImportEntity } from './ImportEntity';

export interface IImportRequest {
  value: string;
  importEntities: ImportEntity[];
}

export class ImportRequest implements IImportRequest {
  value: string;
  importEntities: ImportEntity[];
}
