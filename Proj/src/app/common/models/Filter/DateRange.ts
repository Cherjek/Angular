export module Common.Models.Filter {
    export class DateRange {
        constructor(public FromDate?: any, public ToDate?: any) { }

        Min: any;
        Max: any;
        IsIntervalMode: boolean = true;
    }    
}