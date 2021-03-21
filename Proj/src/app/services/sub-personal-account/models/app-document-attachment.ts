export interface IDocumentAttachment {
  Id: number;
  FileName: string;
  FilePath: string;
}

export class DocumentAttachment implements IDocumentAttachment {
  Id: number;
  FileName: string;
  FilePath: string;
}
