export module Services.ObjectsModule.Models {
    export class ObjectTableView {

        constructor(
            public IdUnit: number,
            public IdLogicDevice: number,
            public UnitDisplayText: string,
            public LogicDeviceDisplayText: string,
            public UnitAdditionalInfo: string,
            public UnitStatuses?: Array<any>,
            public LogicObjectStatuses?: Array<any>,
            public UnitStatusAggregate?: Array<any>,
            public LogicObjectStatusesAggregate?: Array<any>
        ) {}
    }
}