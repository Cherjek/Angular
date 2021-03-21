import { ScheduleStepType } from './ScheduleStepType';

export interface IScheduleStep {
  Id?: number;
  IdSchedule: number;
  StepType: ScheduleStepType;
  StepTypeName: string;
  Name: string;
}

export class ScheduleStep implements IScheduleStep {
  Id?: number;
  IdSchedule: number;
  StepType: ScheduleStepType;
  StepTypeName: string;
  Name: string;
}
