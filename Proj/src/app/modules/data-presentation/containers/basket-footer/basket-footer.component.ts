import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataResultSettingsService, DataResultCompareSettingsService } 
    from '../../../../services/datapresentation.module/DataResultSettings.service';
import { ViewTagsSettings } from '../../../../services/datapresentation.module/Models/ViewTagsSettings';
import { Tag } from '../../../../services/common/Models/Tag';
import { GlobalValues } from '../../../../core';
import { DatePicker } from 'src/app/controls/DatePicker/DatePicker';

export const keyStorageBasketFooterComponent = 'BasketFooterComponent.TagsBasketComponent.DateRangeSettings.storage';

@Component({
    selector: 'rom-basket-footer',
    templateUrl: './basket-footer.component.html',
    styleUrls: ['./basket-footer.component.less']
})
export class BasketFooterComponent implements OnInit, OnDestroy {

    private isLoaded = false;
    public isOnlyLastValue: boolean;
    private errorsResponseToView: any[] = [];

    @Input() PropertyForm = {
        IsHeaderWhiteStyle: false,
        IsShowData: false,
        IsCompareData: false
    };
    private _tags: Tag[];
    @Input()
    set tags(tags: any[]) {
        this._tags = (tags || []).map(t => new Tag(t.Id, t.Code, t.Name));
    }

    @ViewChild('datePicker', { static: false }) datePicker: DatePicker;

    private get dateRangeLocalStorageName() {
        // let url = this.router.url;
        // if (url.indexOf('?') >= 0)  {
        //     url = url.substring(0, url.indexOf('?'));
        // }
        return keyStorageBasketFooterComponent;
    }
    private _fromDate: any;
    public get fromDate() {
        return this._fromDate;
    }
    public set fromDate(val: any) {
        this.saveToStorageDateRange('fromDate', val);
        this._fromDate = val;
    }
    private _toDate: any;
    public get toDate() {
        return this._toDate;
    }
    public set toDate(val: any) {
        this.saveToStorageDateRange('toDate', val);
        this._toDate = val;
    }
    public minDate: any;
    public maxDate: any;
    public fastButtonType = 3;

    private get hierarchyApp() {
        return GlobalValues.Instance.hierarchyApp;
    }
    
    constructor(private router: Router,
                private dataResultSettingsService: DataResultSettingsService,
                private dataResultCompareSettingsService: DataResultCompareSettingsService) { }

    ngOnInit() {
        if (!this.isLoaded) {
            this.onInitDateRange();
            this.isLoaded = true;
        }
    }

    ngOnDestroy() {
        this.saveToStorageDateRange('fastButtonType', this.datePicker.fastButtonType);
    }

    private saveToStorageDateRange(field: string, val: any) {
        if (val) {
            let storage: any = localStorage.getItem(this.dateRangeLocalStorageName);
            if (storage) storage = JSON.parse(storage);
            else storage = {};
            storage[field] = val;
            localStorage.setItem(this.dateRangeLocalStorageName, JSON.stringify(storage));
        }
    }

    private generateRequest() {
        this.errorsResponseToView = [];

        let request: ViewTagsSettings = {
            tags: this._tags.map(t => t.Id as any)
        };
        if (!this.isOnlyLastValue) {
            request = Object.assign({
                fromDate: this.fromDate,
                toDate: this.toDate
            }, request);
        }

        if (!request.tags.length) this.errorsResponseToView.push(AppLocalization.NotChooseTags);
        if (!this.isOnlyLastValue && !request.fromDate) this.errorsResponseToView.push(AppLocalization.NoDateSelected);

        let result = !this.errorsResponseToView.length;

        if (result) {

            if (this.PropertyForm.IsShowData) {
                this.dataResultSettingsService.setSettings(request);
            } else {
                this.dataResultCompareSettingsService.setSettings(request);
            }
        }

        return result;
    }

    showData() {
        if (this.generateRequest()) {
            this.router.navigate([`hierarchy/${this.hierarchyApp.Id}/datapresentation/result`]);
        }
    }

    compareData() {
        if (this.generateRequest()) {
            this.router.navigate([`hierarchy/${this.hierarchyApp.Id}/datapresentation/comparetags`]);
        }
    }

    onInitDateRange() {
        // сперва грузим из кеша
        this.loadDateRangeFromStorage();
        // если это вкладка теги компонента data-result, значит берем из настроек модуля
        this.loadDateRangeFromResultService();
    }

    loadDateRangeFromStorage() {
        let dateRange: any = localStorage.getItem(this.dateRangeLocalStorageName);
        if (dateRange) {
            dateRange = JSON.parse(dateRange);
            if (dateRange.fromDate) this.fromDate = dateRange.fromDate;
            if (dateRange.toDate) this.toDate = dateRange.toDate;
            if (dateRange.fastButtonType) this.fastButtonType = dateRange.fastButtonType;
        }
    }

    loadDateRangeFromResultService() {
        if (this.PropertyForm.IsCompareData) {
            const settings = this.dataResultSettingsService.getSettings();
            if (settings.fromDate) this.minDate = this.fromDate = settings.fromDate;
            if (settings.toDate) this.maxDate = this.toDate = settings.toDate;
        }
    }
}
