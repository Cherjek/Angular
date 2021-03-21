export interface INotificationHierarchySettings {
  IdNotificationSettings: number;
  IdHierarchy: number;
  IdHierarchyNodes: number[];
}

export class NotificationHierarchySettings
  implements INotificationHierarchySettings {
  IdNotificationSettings: number;
  IdHierarchy: number;
  IdHierarchyNodes: number[];
}
