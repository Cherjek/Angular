export class ValueTable {

    IdDeviceTag: number;
    Datetime: any;// Время показания.
    IdQuality: string;// Идентификатор статуса показания. Справочник ValueQuality представлен в SQL.
    ValueFloat?: number;// Значение показания в виде числа с плавающей запятой.
    ValueInt: number;// Значение показания в виде челого числа.
    ValueData: string;// Значение показания в строковом представлении.
    ValueBool?: boolean;// Значение показания в булевом виде.
    Value: any;// аггрегированное значение ValueFloat, ValueInt, ValueData, ValueBool - зависит от IdQuality

}