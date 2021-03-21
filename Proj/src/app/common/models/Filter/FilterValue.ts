export class FilterValue {

    constructor(public Value: any, public OperationType: string | FilterOperationType) {
        if (OperationType && typeof (OperationType) === "string") {
            this.OperationType = this.convertOperation[OperationType];
        }
    }

    private convertOperation = {
        "Equal": FilterOperationType.Equal,
        "NotEqual": FilterOperationType.NotEqual,
        "GreaterThan": FilterOperationType.GreaterThan,
        "GreaterThanOrEqual": FilterOperationType.GreaterThanOrEqual,
        "LessThan": FilterOperationType.LessThan,
        "LessThanOrEqual": FilterOperationType.LessThanOrEqual
    }

    /**
     * ===, !==, >, >=, <, <= 
     */
    get OperationOperator (): string {
        let operator;
        if (this.OperationType === FilterOperationType.Equal) operator = "===";
        else if (this.OperationType === FilterOperationType.NotEqual) operator = "!==";
        else if (this.OperationType === FilterOperationType.GreaterThan) operator = ">";
        else if (this.OperationType === FilterOperationType.GreaterThanOrEqual) operator = ">=";
        else if (this.OperationType === FilterOperationType.LessThan) operator = "<";
        else if (this.OperationType === FilterOperationType.LessThanOrEqual) operator = "<=";
        else operator = "===";

        return operator;
    }
}

export enum FilterOperationType { Contains, Equal, NotEqual, GreaterThan, GreaterThanOrEqual, LessThan, LessThanOrEqual }