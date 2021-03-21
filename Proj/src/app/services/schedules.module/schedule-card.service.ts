import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { Observable } from 'rxjs';
import { IScheduleEdit } from './Models/ScheduleEdit';
import { IScheduleHierarchyNodes } from './Models/ScheduleHierarchyNodes';

@Injectable()
export class ScheduleCardService extends WebService<IScheduleEdit | IScheduleHierarchyNodes | number> {
  URL = 'schedule';
  userGroupsCache: any;

  getSchedule(id: number): Observable<IScheduleEdit> {
    return super.get(id) as Observable<IScheduleEdit>;
  }

  postSchedule(schedule: IScheduleEdit) {
   return super.post(schedule);
  }

  deleteSchedule(id: number) {
    return super.delete(id);
  }

  getScheduleHierarchyNodes(idSchedule: number) {
    return super.get(`${idSchedule}/nodes`) as Observable<IScheduleHierarchyNodes>;
  }

  getUserGroups() {
    return super.get('user-groups');
  }

  setScheduleHierarchyNodes(idSchedule: number, hierarchyNodes: IScheduleHierarchyNodes) {
    return super.post(hierarchyNodes, `${idSchedule}/nodes`);
  }

  activeSchedule(idSchedule: number) {
    return super.post(null, `${idSchedule}/active/1`);
  }

  deactiveSchedule(idSchedule: number) {
    return super.post(null, `${idSchedule}/active/0`);
  }

  startSchedule(idSchedule: number) {
    return super.post(null, `${idSchedule}/start`);
  }

  activeSchedules(idSchedules: number[]) {
    return super.post(idSchedules, `/active/1`);
  }

  deactiveSchedules(idSchedules: number[]) {
    return super.post(idSchedules, `/active/0`);
  }

  startSchedules(idSchedules: number[]) {
    return super.post(idSchedules, `/start`);
  }
}
