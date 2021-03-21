import { Entity } from './Entity';

export interface IImportEntity {
  EntityType: string;
  Entities: Entity[];
}

export class ImportEntity implements IImportEntity {
  EntityType: string;
  Entities: Entity[];
}
