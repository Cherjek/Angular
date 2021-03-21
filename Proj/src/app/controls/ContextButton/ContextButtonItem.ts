export class ContextButtonItem {
    code: string;
    name: string;
    isDisabled?: boolean;
    confirm?: ContextButtonItemConfirm;
}

export class ContextButtonItemConfirm {
    constructor(public text: string, public apply: string) {}
}
