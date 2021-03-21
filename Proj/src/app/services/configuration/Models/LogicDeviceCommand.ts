import { IData } from './Data';

export interface ILogicDeviceCommand {
    Id?: number;
    IdLogicDevice: number;
    CommandType: IData;
    Description: string;
}

export class LogicDeviceCommand implements ILogicDeviceCommand {
    Id?: number;
    IdLogicDevice: number;
    CommandType: IData;
    Description: string;
}