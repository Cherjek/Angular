import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule, Injector } from '@angular/core';
import { RouterModule } from '@angular/router';
import { createCustomElement } from '@angular/elements';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DetailViewHostDirective } from './ListComponentCommon/DetailsRow/Directives/DetailViewHost';
import { DetailComponent } from './ListComponentCommon/DetailsRow/DetailComponent/DetailComponent';
import { DataGrid, HeaderTemplateDefComponent } from './DataGrid';
import { TreeView } from './TreeView/TreeView';
import { ListView } from './ListView/ListView';
import { ListViewFilterRow } from './ListView/Pipes/Filter';
import { ListViewOrderRow } from './ListView/Pipes/Order';
import { CheckBox } from './CheckBox/CheckBox';
import { InputBox } from './InputBox/InputBox';
import { ContextButton } from './ContextButton/ContextButton';
import { UploadFile } from './UploadFile/UploadFile';
import { DatePicker } from './DatePicker/DatePicker';
import { DatePickerNgb } from './DatePickerNgb/DatePickerNgb';
import { CalendarPickerRo5Component } from './CalendarPicker/calendar-picker-ro5.component';
import { Loader } from './Loader/Loader';
import { Navigate, NavigateRouteItemComponent, NavigateTabItemComponent } from './Navigate';
import { Chips } from './Chips/Chips';
import { ToggleSwitch } from './ToggleSwitch/ToggleSwitch';
import { ComboBox } from './ComboBox/ComboBox';
import { DropDownBox } from './DropDownBox/DropDownBox';
import { Button } from './Button/Button';
import { ExportToXlsx } from './Services/ExportToXlsx';
import { DateTimePickerModule } from 'ng-pick-datetime';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AmChartsModule } from '@amcharts/amcharts3-angular';
import { TreeviewModule } from 'ngx-treeview';

/* common modules */
import { RomDirectivesModule } from '../shared/rom-directives/rom-directives.module';
import { RomPipesModule } from '../shared/rom-pipes/rom-pipes.module';
import { TimePickerRo5Component } from './TimePicker/time-picker-ro5.component';
import { TitleCellPipe } from './DataGrid/pipes/title-cell.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        DateTimePickerModule,
        VirtualScrollerModule,
        NgbModule,
        AmChartsModule,
        DragDropModule,
        TreeviewModule.forRoot(),
        // RomSharedModule

        RomDirectivesModule,
        RomPipesModule
    ],
    exports: [
        /// CONTROLS
        DateTimePickerModule,
        NgbModule,

        DetailViewHostDirective,
        DetailComponent,
        DataGrid,
        TitleCellPipe,
        HeaderTemplateDefComponent,

        TreeView,
        ListView,
        CheckBox,
        InputBox,
        ContextButton,
        UploadFile,
        DatePicker,
        DatePickerNgb,
        Loader,
        Navigate,
        NavigateRouteItemComponent,
        NavigateTabItemComponent,
        Chips,
        ToggleSwitch,
        ComboBox,
        DropDownBox,
        Button,
        CalendarPickerRo5Component,
        TimePickerRo5Component,

        RomDirectivesModule,
        RomPipesModule
    ],
    providers: [
        ExportToXlsx
    ],
    entryComponents: [DatePicker, DatePickerNgb],
    declarations: [
        /// CONTROLS
        DetailViewHostDirective,
        DetailComponent,
        DataGrid,
        TitleCellPipe,
        HeaderTemplateDefComponent,

        TreeView,
        ListView,
        ListViewFilterRow,
        ListViewOrderRow,
        CheckBox,
        InputBox,
        ContextButton,
        UploadFile,
        DatePicker,
        DatePickerNgb,
        Loader,
        Navigate,
        NavigateRouteItemComponent,
        NavigateTabItemComponent,
        Chips,
        ToggleSwitch,
        ComboBox,
        DropDownBox,
        Button,
        CalendarPickerRo5Component,
        TimePickerRo5Component
    ]
})
export class ControlsModule {

    constructor(public injector: Injector, ) {
        if (!customElements.get('datepicker-element')) {
            // ������� � ������������ ���������
            // Convert `DatePicker` to a custom element.
            const datePickerElement = createCustomElement(DatePicker, { injector });
            // Register the custom element with the browser.
            customElements.define('datepicker-element', datePickerElement);
        }
    }
}
