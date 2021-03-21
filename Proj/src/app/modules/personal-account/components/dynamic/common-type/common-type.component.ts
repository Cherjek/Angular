import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Observable, Observer } from 'rxjs';
//import { map, delay, catchError, tap } from 'rxjs/operators';

import { GlobalValues, Utils } from '../../../../../core';

import { PersonalAccountService, TagCommonTable } from '../../../../../services/personalaccount.module/index';

import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'common-type',
    templateUrl: './common-type.component.html',
    styleUrls: ['./common-type.component.less']
})
export class CommonTypeComponent implements OnInit {

    public errors: any[] = [];
    public changeSelectView: boolean;
    public loadingTable = false;

    height: number;
    width: number;

    logicDevice: any;
    private _unit: any;
    get unit(): any {
        return this._unit;
    }
    set unit(unit: any) {
        this._unit = unit;

        this.changeSelectView = unit == null ? false : true;
    }

    public tagTable: TagCommonTable[];
    displayedColumns: string[] = ['LogicDeviceDisplayText', 'TagDisplayText', 'Date', 'Value'];
    dataSource: MatTableDataSource<TagCommonTable>;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(private periodTypesService: PersonalAccountService) {
    }

    ngOnInit() {
    }

    public loadTable() {
        
        GlobalValues.Instance.Page = { isTableLoad: true };

        const _finally = () => {
            GlobalValues.Instance.Page.isTableLoad =
                this.loadingTable =
                this.changeSelectView = false;
        }

        this.periodTypesService
            .getCommonTagsValue(this.unit.Id)
            .subscribe((result: TagCommonTable[]) => {
                    this.tagTable = result;

                    this.dataSource = new MatTableDataSource<TagCommonTable>(this.tagTable);
                    this.dataSource.sort = this.sort;

                    _finally();
                },
                (error: any) => {
                    this.errors = [error];
                    _finally();
                });
    }
}
