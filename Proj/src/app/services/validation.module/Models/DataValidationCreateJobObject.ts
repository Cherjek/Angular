export module Services.ValidationModule.Models {
    export class DataValidationCreateJobObject {
        constructor(
            public Id: string,
            public Name: string,
            public IsCheck: boolean,
            public Items: Array<DataValidationCreateJobObject>
        ) {

        }
    }
}