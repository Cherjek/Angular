import { IData } from '../../data-query';

export interface IManagement {
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

export class Management implements IManagement {
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