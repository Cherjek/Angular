import { IDataQueryDates } from './DataQueryDates';
import { IData } from '../../data-query';
import { IEMailRecipient } from './EMailRecipient';

export interface IBuildReportStepSettings {
    DateRange: IDataQueryDates;
    ReportTypes: IData[];
    Compress: boolean;
    OnePerHierarchyNode: boolean;
    SendByEMail: boolean;
    EMailSubjectPattern: string;
    EMailBodyPattern: string;
    OneEMailPerReportFile: boolean;
    EMailRecipients: IEMailRecipient[];
}

export class BuildReportStepSettings implements IBuildReportStepSettings {
    ReportTypes: IData[];
    Compress: boolean;
    OnePerHierarchyNode: boolean;
    SendByEMail: boolean;
    EMailSubjectPattern: string;
    OneEMailPerReportFile: boolean;
    EMailBodyPattern: string;
    EMailRecipients: IEMailRecipient[];
    DateRange: IDataQueryDates;
}