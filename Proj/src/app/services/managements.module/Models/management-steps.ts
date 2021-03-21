import { IData } from '../../data-query';

export interface IManagementSteps {
  Id: number;
  CorrelationId: string;
  Name: string;
  CreateDate: string;
  StartDate: string;
  FinishDate: string;
  State: IData;
  Progress: number;
  DirectorInstance: string;
  ExecutorInstance: string;
  UserName: string;
  TaskTypeCode: string;
}

export class ManagementSteps implements IManagementSteps {
  Id: number;
  CorrelationId: string;
  Name: string;
  CreateDate: string;
  StartDate: string;
  FinishDate: string;
  State: IData;
  Progress: number;
  DirectorInstance: string;
  ExecutorInstance: string;
  UserName: string;
  TaskTypeCode: string;
}
