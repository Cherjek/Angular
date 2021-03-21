export module Common.Models.Filter {
    export class Lookup {

        constructor(public DataSource: any, public LookupField?: LookupField) { }

        TreeOptions: any;
        GridOptions: GridLookupOptions;
    }

    export class LookupField {
        constructor(public DisplayField: string, public ValueField: string) { }
    }

    export class GridLookupOptions {
        constructor(public DisplayField: string, public ValueField: string) { }
    }
}