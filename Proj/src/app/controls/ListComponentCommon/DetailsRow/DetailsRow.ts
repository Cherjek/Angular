import { Type } from "@angular/core";
import { IDetailsRow, IDetailsRowComponent } from "./IDetailsRow";
declare var $: any;

const key_name_row = "#dataRowObject";

export class DetailsRowComponent implements IDetailsRowComponent {
    constructor(public caption: string, public component: Type<any>, public params?: any) { }
}

export class DetailsRow implements IDetailsRow {

    rowData: any;
    rowExpanded: any;
    rowTarget: string;
    isAsyncStart: boolean;
    isExpandedComplete: boolean;
    components: IDetailsRowComponent[];
    currentView: IDetailsRowComponent;

    //function:
    //показывает признак, что строка в процессе открытия, т.е. по ней только что кликнули на раскрытие по кнопке expand
    isRowExpand(key: any) {
        if (this.rowTarget) {
            return this.rowTarget === `${key_name_row}${key}`;
        }
        return false;
    };
    //признак, что строка детализации видна, rowExpanded будет задан после асинхронных операций
    isRowExpanded(key: any) {
        if (this.rowExpanded) {
            return key === this.rowExpanded && this.isExpandedComplete;
        }
        return false;
    }
    startAsync() {
        this.isAsyncStart = true;
        this.closeExpandedRow();
    }
    stopAsync() {
        this.isAsyncStart = false;
        this.expanded();
    }
    expandedCallback: any;
    collapsedCallback: any = this.closeExpandedRow;
    expanded() {
        $(this.rowTarget)
            .on('shown.bs.collapse', () => {
                if (this.expandedCallback == null) throw "не реализован метод DetailsRow.expandedCallback в коде клиента";

                this.isExpandedComplete = true;
                this.expandedCallback();
            })
            .collapse('show');
    }
    collapsed() {
        $(this.rowTarget)
            .on('hidden.bs.collapse', () => {
                
                if (this.collapsedCallback) this.collapsedCallback();
            })
            .collapse('hide');
    }


    closeExpandedRow() {
        this.rowTarget = null;
        this.rowExpanded = null;
        this.rowData = null;
        this.isExpandedComplete = false;
    }
}