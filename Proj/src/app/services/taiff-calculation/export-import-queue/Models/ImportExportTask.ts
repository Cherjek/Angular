export interface ImportExportTask {
  CalculationType: CalculationType;
  CalculationTypeReport: CalculationType;
  MonthDate: string;
  HierarchyId: number;
  CalculationGroups: any[];
  SeparateLogicDevices: boolean;
  Files?: any;
  Id: number;
  CorrelationId: string;
  Name: string;
  CreateDate: string;
  StartDate?: any;
  UpdateDate: string;
  FinishDate: string;
  State: CalculationType;
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
  Name: string;
  PhoneNumber: string;
  Email: string;
  CreationDate: string;
  IdAuthenticityType: string;
}

interface CalculationType {
  Id: number;
  Code: string;
  Name: string;
}