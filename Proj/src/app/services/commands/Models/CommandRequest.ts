import { CommandType } from './Command';

export interface ICommandRequest {
    IdHierarchy: number;
    LogicDevices: number[];
    Name: string;
    CommandType: CommandType;
}

export class CommandRequest implements ICommandRequest {
    IdHierarchy: number;
    LogicDevices: number[];
    Name: string;
    CommandType: CommandType;
}