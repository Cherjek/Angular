import { IData } from '../../data-query';
import { IParameter } from './parameter';

export interface IManagementParams {
  IdHierarchy: number;
  IdLogicDevices: any[];
  Command: IData;
  Parameters: IParameter[];
  Id: number;
  CorrelationId: string;
  Name: string;
  CreateDate: string;
  StartDate: string;
  FinishDate?: any;
  State: IData;
  Progress: number;
  DirectorInstance: string;
  ExecutorInstance: string;
  UserName: string;
  TaskTypeCode: string;
}

export class ManagementParams implements IManagementParams {
  IdHierarchy: number;
  IdLogicDevices: any[];
  Command: IData;
  Parameters: IParameter[];
  Id: number;
  CorrelationId: string;
  Name: string;
  CreateDate: string;
  StartDate: string;
  FinishDate?: any;
  State: IData;
  Progress: number;
  DirectorInstance: string;
  ExecutorInstance: string;
  UserName: string;
  TaskTypeCode: string;
}
