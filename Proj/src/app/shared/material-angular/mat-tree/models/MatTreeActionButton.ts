import { IMatTreeActionButtonConfirmSettings } from './MatTreeActionButtonConfirmSettings';

export interface IMatTreeActionButton {
    code: string;
    displayText: string;
    confirmSettings?: IMatTreeActionButtonConfirmSettings;
    isConfirm?: boolean;
}

export class MatTreeActionButton implements IMatTreeActionButton {

    // isConfirm: boolean; определяет содержит ли кнопка подтверждение нажатия - н-р кнопка удалить
    constructor(public code: string, public displayText: string, public confirmSettings?: IMatTreeActionButtonConfirmSettings) {

        this.isConfirm = (confirmSettings != null);
    }

    isConfirm?: boolean;
    // можно переопределить в компоненте данный метод, для обработки условий отображения кнопки в меню ActionButtons
    isValid(data: any): boolean {
        return true;
    }
}