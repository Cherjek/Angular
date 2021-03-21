import { BaseTaskParameters } from 'src/app/services/property-update/Models/interfaces/BaseTaskParameters';

export interface ImportExportTaskResult {
  IsExport: boolean;
  ExportParameters?: ImpExpParameters;
  ImportParameters: ImpExpParameters;
  Files?: any;
  Id: number;
  CorrelationId: string;
  Name: string;
  CreateDate: string;
  StartDate: string;
  UpdateDate: string;
  FinishDate: string;
  State: State;
  Progress: number;
  DirectorInstance: string;
  ExecutorInstance: string;
  User: User;
  TaskType: number;
}

interface User {
  Id: number;
  IsBlocked: boolean;
  Login: string;
  Name?: any;
  PhoneNumber?: any;
  Email: string;
  CreationDate: string;
  IdAuthenticityType: string;
}

interface State {
  Id: number;
  Code: string;
  Name: string;
}

export interface ImpExpParameters extends BaseTaskParameters {
  ActionType: ActionType;
}

interface ActionType {
  Code: string;
  Name: string;
}
