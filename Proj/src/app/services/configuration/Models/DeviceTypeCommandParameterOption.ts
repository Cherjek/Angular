export interface IDeviceTypeCommandParameterOption {
  Id: number;
  IdDeviceTypeCommandParameter: number;
  Value: string;
  Text: string;
}

export class DeviceTypeCommandParameterOption
  implements IDeviceTypeCommandParameterOption {
  Id: number;
  IdDeviceTypeCommandParameter: number;
  Value: string;
  Text: string;
}
