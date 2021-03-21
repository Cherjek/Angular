export interface IMatTreeActionButtonConfirmSettings {
    confirmBody: string;
    confirmButtonText: string;
}

export class MatTreeActionButtonConfirmSettings implements IMatTreeActionButtonConfirmSettings {
    //ConfirmText: string;//текст подтверждения - "Вы уверены, что хотите удалить"
    //ConfirmButtonText: string;//текст подтверждения кнопки - "Удалить"
    constructor(public confirmBody: string, public confirmButtonText: string) { }
}