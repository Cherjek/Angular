import { IData } from '../../data-query/Models/Data';

export class IAppDocumentType {
  Id: number;
  IdApplication: number;
  Code: string;
  Name: string;
  DocumentDirectionType: IData;
}

export class AppDocumentType implements IAppDocumentType {
  Id: number;
  IdApplication: number;
  Code: string;
  Name: string;
  DocumentDirectionType: IData;
}
