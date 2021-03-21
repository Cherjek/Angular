import { IEntityViewProperty } from '../Interfaces/IEntityViewProperty';

/* 
* Общий класс для свойств всех сущностей
* Code: идентификатор свойства
* Name: текстовое наименование сущности(Н-р: Наименование)
* Type: 
*       Float = 1,
        //
        // Summary:
        //     System.Int64
        Integer = 2,
        //
        // Summary:
        //     System.Boolean
        Bool = 3,
        //
        // Summary:
        //     System.String
        String = 4,
        //
        Interval = 5,
        //
        // Summary:
        //     System.DateTime
        Datetime = 7,
        //
        // Summary:
        //     RMon.Data.Provider.Units.PropertyGrid.OptionValueView
        Option = 15,
        //
        // Summary:
        //     RMon.Data.Provider.PropertyGrid.IOptionValue RMon.Data.Provider.PropertyGrid.ITreeNode
        //     при запросе доступных значений
        OptionTree = 16
*/
export class EntityViewProperty implements IEntityViewProperty {
    Code: string;
    Name: string;
    Type: number | string;
    Value: any;
    ReadOnly?: boolean;
    IsRequired?: boolean;    
    DependProperties?: string[];
    ParentProperties?: string[];
    IsDateInterval?: boolean;
}