export interface ITagView {
    Id: number;
    Code: string;
    Name: string;
    UnitName: string;
    ValueType: string;
}

export class TagView implements ITagView {
    Id: number;
    Code: string;
    Name: string;
    UnitName: string;
    ValueType: string;
}