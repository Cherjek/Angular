export module Services.ValidationModule.Models {
    export class DataValidationJobObject {
        constructor(
            public Id: string,
            public Name: string,
            public Items: Array<DataValidationJobObject>
        ) {

        }
    }
}