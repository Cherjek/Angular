import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DataGrid } from '../../DataGrid';

@Component({
    selector: 'datagrid-header-temp-def',
    templateUrl: './header-template-def.component.html',
    styleUrls: ['./header-template-def.component.less']
})
export class HeaderTemplateDefComponent {
    @Input() dataGrid: DataGrid;
    @Input() permissionDelete: string | any;
    @Output() deletedRows = new EventEmitter<any>();
    
    public deleteRows() {
        this.deletedRows.emit();
    }
}