import { Tag } from '../../common/Models/Tag';

export module Services.ValidationModule.Models {
    export class DataValidationCreateSetting {
        constructor(
            public Allowance: number,
            public DateStart: any,
            public DateEnd: any,
            public JobName: string,
            public Issues: Array<Issue>,
            public LogicDeviceIds: any[],
            public ByHierarchy: boolean = false,
            public IdHierarchy?: number
        ) {
            
        }
    }

    export class Issue {
        constructor(
            public Id: string,
            public Name: string,
            public Code: string,
            public Tags: Array<Tag>
        ) {
            
        }
    }

    export class TagSettings extends Tag {
        constructor(
            public Id: number,
            public Name: string,
            public Code: string,
            public IssueTagSettings: Array<IssueTagSettings>
        ) {
            super(Id, Name, Code);
        }

    }

    export class IssueTagSettings {
        constructor(
            public Code: string,
            public Name: string,
            public Value: string,
            public EditorType: string,
            /// <summary>
            /// Единица измерения, текст
            /// </summary>
            public UnitName: string
        ) {

        }
    }
}