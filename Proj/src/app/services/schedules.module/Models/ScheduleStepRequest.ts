import { IScheduleStep, ScheduleStep } from '..';
import { DataQueryStepSettings } from './DataQueryStepSettings';
import { BuildReportStepSettings } from './BuildReportStepSettings';

export interface IScheduleStepRequest extends IScheduleStep {
  DataQuery: DataQueryStepSettings;
  BuildReport: BuildReportStepSettings;
}

export class ScheduleStepRequest extends ScheduleStep implements IScheduleStepRequest {
  DataQuery: DataQueryStepSettings;
  BuildReport: BuildReportStepSettings;
}
