import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Observable, Observer } from 'rxjs';
//import { map, delay, catchError, tap } from 'rxjs/operators';

import { PersonalAccountService, TagTable, TagValue } from '../../../../../services/personalaccount.module/index';
import { GlobalValues, Utils } from '../../../../../core';

import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'specific-type',
    templateUrl: './specific-type.component.html',
    styleUrls: ['./specific-type.component.less']
})
export class SpecificTypeComponent implements OnInit {

    height: number;
    width: number;

    unit: any;
    private _logicDevice: any;
    get logicDevice(): any {
        return this._logicDevice;
    }
    set logicDevice(ld: any) {
        this._logicDevice = ld;

        this.changeSelectView = ld == null ? false : true;
        if (ld != null) {
            this.initPeriodTypes();
        }
    }

    public timestampType: any;
    public fromDate: any;
    public toDate: any;

    public loadingTimestampType: boolean;
    public changeSelectView: boolean;
    public loadingTable: boolean = false;

    public periodTypes: string[] = [];
    public errors: any[] = [];

    public tagTable: TagTable[];
    private tagTableValues: TagValue[];
    displayedColumns: string[] = ['Date', 'Value'];
    dataSource: MatTableDataSource<TagValue>;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(private periodTypesService: PersonalAccountService) { }

    ngOnInit() {
    }

    private initPeriodTypes() {

        this.loadingTimestampType = true;

        const logicDeviceId: number = this.logicDevice.Id;
        this.periodTypesService.getLDPeriodTypes(logicDeviceId).subscribe(
            (periods: any[]) => {
                this.periodTypes = periods;
                if (periods.length) {
                    this.timestampType = periods[0];
                }

                this.loadingTimestampType = false;
            },
            (error: any) => {
                this.errors = [error];
                this.loadingTimestampType = false;
            }
        );
    }

    public loadTable() {

        if (this.timestampType == null) {
            const error = AppLocalization.NotSpecifiedTypeOfTimemp;
            this.errors = [error];
            throw error;
        }

        this.loadingTable = true;
        GlobalValues.Instance.Page = { isTableLoad: true };

        const request = {
            TimestampType: this.timestampType.Code,
            LogicDeviceId: this.logicDevice.Id,
            DateStart: this.fromDate,
            DateEnd: this.toDate
        }

        const _finally = () => {
            GlobalValues.Instance.Page.isTableLoad =
                this.loadingTable =
                this.changeSelectView = false;
        }

        this.periodTypesService
            .getTagsValue(request)
            .then((result: TagTable[]) => {
                this.tagTable = result;
                if (result.length > 0) {
                    this.selectTabTag(0);
                }

                _finally();
            },
                (error: any) => {
                    this.errors = [error];
                    _finally();
                });
    }

    public selectTabTag(index: number) {
        this.tagTableValues = this.tagTable[index].Value;
        this.dataSource = new MatTableDataSource<TagValue>(this.tagTableValues);
        this.dataSource.sort = this.sort;
    }
}