export interface ITariffAttachment {
  Id: number;
  FileName: string;
  FilePath: string;
}

export class TariffAttachment implements ITariffAttachment {
  Id: number;
  FileName: string;
  FilePath: string;
}
