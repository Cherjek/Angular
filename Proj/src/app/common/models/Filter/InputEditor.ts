export module Common.Models.Filter {

    export enum TypeEditor { Text, Number, Float, Bool }

    export class InputEditor {

        private typeEditor = TypeEditor.Text;

        constructor(typeEditor?: TypeEditor, public Value?: any) {
            this.typeEditor = typeEditor;
        }

        getType(): TypeEditor {
            return this.typeEditor;
        }
    }
}