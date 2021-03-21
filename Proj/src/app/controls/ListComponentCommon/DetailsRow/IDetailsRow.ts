import { Type } from '@angular/core';

export interface IDetailsRowComponent {
    caption: string;
    component: Type<any>;
    params?: any;
}

export interface IDetailsRow  {
    rowData: any;
    rowExpanded: any;
    rowTarget: string;
    isAsyncStart: boolean;
    components: IDetailsRowComponent[];//список компонент, которые динамически загружаются при выборе таба
    currentView: IDetailsRowComponent;
    //function:
    isRowExpand: any;//показывает признак, что строка в процессе открытия, т.е. по ней только что кликнули на раскрытие по кнопке expand
    isRowExpanded: any;//признак, что строка детализации видна
    startAsync: any;
    stopAsync: any;
    expanded: any;
    collapsed: any;
    expandedCallback: any;//метод который вызывается после анимации раскрытия
    collapsedCallback: any;//метод который вызывается после анимации закрытия
}