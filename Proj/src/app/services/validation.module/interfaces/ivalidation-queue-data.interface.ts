export interface IValidationQueueData {
    Id: string;
    CreateDate?: string;
    EndDate?: string;
    IdTargetUserGroup?: string;
    IsEndState?: boolean;
    IsFinished?: boolean;
    Name?: string;
    Progress?: number;
    StartDate?: string;
    Status?: string;
    StatusName?: string;
    TargetUser?: string;
    UpdateDate?: string;
    UserName?: string;
    WorkerUser?: string;
}
