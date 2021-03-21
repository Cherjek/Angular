export class User {

    //доступные разрешения, коды разрешений
    permissions: Set<string>;

    //доступные разрешения для объектов
    //ключ: "OC_VIEW_OBJECT_PROPERTIES","OC_VIEW_DEVICE_PROPERTIES","DR_START"...
    //значение: [3332, 3940, 3942, 3946, 3948...]
    permissionUnit: Map<string, Set<number>>;

    //доступные разрешения для оборудования
    permissionLogicDevices: Map<string, Set<number>>;

    //доступные разрешения для иерархий
    permissionHierarchies: Map<string, Set<number>>;
}