export module Services.ValidationModule.Models {
    export class DataValidationJobResult {
        constructor(
            public Id: string,
            public DateStart: any,
            public DateEnd: any,
            public Tag: string,
            public LogicDevice: string,
            public Unit: string) {}
    }
}