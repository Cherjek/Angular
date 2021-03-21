export interface IEntityViewProperty {
    Code: string;
    Name: string;
    Type: number | string;
    Value: any;
    ReadOnly?: boolean;
    IsRequired?: boolean;    
    DependProperties?: string[];
    ParentProperties?: string[];
    IsDateInterval?: boolean;
    IsMonthMode?: boolean;
    IsTimeShow?: boolean;
    TextPrecede?: string;
    IsNotShown?: boolean;
    arrayValues?: any[];
    IsNullName?: string;
}