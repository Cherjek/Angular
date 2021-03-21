import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { WebService } from '../common/Data.service';
import { NotificationSettings } from '../commands/Models/NotificationSettings';
import { AddressBook } from '../commands/Models/AddressBook';
import { SubSystem } from '../references/models/SubSystem';
import { NotificationHierarchySettings } from '../commands/Models/NotificationHierarchySettings';
import { NotificationHierarchySchedule } from '../commands/Models/NotificationHierarchySchedule';

@Injectable()
export class NotificationSettingsService extends WebService<
  NotificationSettings | any
> {
  URL = 'notification/settings';
  notificationId: any;

  getAddress() {
    return super.get(`${this.notificationId}/address`);
  }

  postAddress(data: AddressBook[]) {
    return super.post(data, `${this.notificationId}/address`);
  }

  getSubsystems() {
    return super.get(`${this.notificationId}/sub-system`);
  }

  postSubsystems(data: SubSystem[]) {
    return super.post(data, `${this.notificationId}/sub-system`);
  }

  getHierarchies(): Observable<NotificationHierarchySettings> {
    return super.get(`${this.notificationId}/hierarchies`);
  }

  postHierarchies(data: NotificationHierarchySettings) {
    return super.post(data, `${this.notificationId}/hierarchies`);
  }

  getHierarchiesSchedule(): Observable<NotificationHierarchySchedule> {
    return super.get(`${this.notificationId}/hierarchies/schedule`);
  }

  postHierarchiesSchedule(data: NotificationHierarchySchedule) {
    const ids = data.Nodes.map((x) => x.Id);
    const obj = {
      IdNotificationSettings: this.notificationId,
      IdHierarchy: data.Hierarchy.Id,
      IdHierarchyNodes: ids,
    };
    return super.post(obj, `${this.notificationId}/hierarchies`);
  }
}
