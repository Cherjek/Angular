import { IData } from './../../data-query/Models/Data';
import { IDocumentAttachment } from './app-document-attachment';
import { IAppDocumentType } from './app-document-type';
import { ICustomer } from './Customer';

export interface IAppDocument {
  Id: number;
  DateTime: string;
  Application: {
    Id: string;
    Name: string;
  };
  Customer: ICustomer;
  Direction: IData;
  Type: IAppDocumentType;
  Status: IData;
  Name: string;
  Text: string;
  Viewed: boolean;
  Attachments: IDocumentAttachment[];
  AttachmentNames?: string[];
}

export class AppDocument implements IAppDocument {
  Id: number;
  DateTime: string;
  Application: { Id: string; Name: string };
  Customer: ICustomer;
  Direction: IData;
  Type: IAppDocumentType;
  Status: IData;
  Name: string;
  Text: string;
  Viewed: boolean;
  Attachments: IDocumentAttachment[];
}
