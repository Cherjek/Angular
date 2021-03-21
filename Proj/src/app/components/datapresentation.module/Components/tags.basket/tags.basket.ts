import { AppLocalization } from 'src/app/common/LocaleRes';
import {
    Component,
    AfterViewInit,
    AfterContentChecked,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    ElementRef
} from '@angular/core';
import { Router, ActivatedRoute, Route } from '@angular/router';

import { ListView } from '../../../../controls/ListView/ListView';

import { DataResultSettingsService, DataResultCompareSettingsService } from '../../../../services/datapresentation.module/DataResultSettings.service';
import { ViewTagsSettings } from '../../../../services/datapresentation.module/Models/ViewTagsSettings';

@Component({
    selector: 'tags-basket',
    templateUrl: 'tags.basket.html',
    styleUrls: ['tags.basket.css']
})

export class TagsBasketComponent implements AfterViewInit, AfterContentChecked {

    private isLoaded: boolean;

    constructor(public router: Router,
        public activateRoute: ActivatedRoute,
        public dataResultSettingsService: DataResultSettingsService,
        public dataResultCompareSettingsService: DataResultCompareSettingsService) {
    }

    @Input() KeyField: string;

    @Input() loading: boolean = false;
    @Input() objectsLVLoading: boolean = false;
    @Input() DGLoading: boolean = false;

    @Input() PropertyForm = {
        IsHeaderWhiteStyle: false,
        IsShowData: false,
        IsCompareData: false
    };

    @ViewChild('basketLV', { static: true }) basketLV: ListView;
    @ViewChild('footer', { static: true }) footer: ElementRef;

    @Output() onDroppedTags = new EventEmitter<any>();

    public errorsResponseToView: any[] = [];

    ngAfterViewInit() {
        this.basketLV.OffsetBottom = this.footer.nativeElement.offsetHeight;
        this.basketLV.resizeVirtualScroll();
    }

    ngAfterContentChecked(): void {
        if (!this.isLoaded) {
            this.onInitDateRange();
            this.isLoaded = true;
        }
    }

    _fromDate: any;
    get fromDate() {
        return this._fromDate;
    }
    set fromDate(val: any) {
        this.saveToStorageDateRange("fromDate", val);
        this._fromDate = val;
    }
    _toDate: any;
    get toDate() {
        return this._toDate;
    }
    set toDate(val: any) {
        this.saveToStorageDateRange("toDate", val);
        this._toDate = val;
    }
    minDate: any;
    maxDate: any;

    saveToStorageDateRange(field: string, val: any) {
        if (val) {
            let storage: any = localStorage.getItem(this.dateRangeLocalStorageName);
            if (storage) storage = JSON.parse(storage);
            else storage = {};
            storage[field] = val;
            localStorage.setItem(this.dateRangeLocalStorageName, JSON.stringify(storage));
        }
    }

    @Input()
    set DataSource(value: any[]) {
        this.basketLV.DataSource = value;
    }
    get DataSource(): any[] {
        return this.basketLV.DataSource;
    }

    set Filter(value: any) {
        this.basketLV.Filter = value;
    }
    get Filter() {
        return this.basketLV.Filter;
    }

    get dateRangeLocalStorageName() {
        let url = this.router.url;
        if (url.indexOf('?') >= 0) url = url.substring(0, url.indexOf('?'));
        return `${url}.TagsBasketComponent.DateRangeSettings`;
    }

    isOnlyLastValue: boolean;

    dropAllTags() {
        this.objectsLVLoading = true;
        this.DGLoading = true;

        this.DataSource.forEach(LI => {
            LI.IsCheck = false;
            LI.IsIndeterminate = false;
        });
        let DataSourceClone: any[] = JSON.parse(JSON.stringify(this.DataSource));

        this.DataSource = [];
        this.onDroppedTags.emit(DataSourceClone);
    }

    dropSomeTags(tags: any[]) {
        this.loading = true;

        this.objectsLVLoading = true;
        this.DGLoading = true;

        let Src: any[] = this.basketLV.DataSource;
        let Srclen: number = Src.length;
        while (Srclen--) {
            if (Src[Srclen].IsCheck) {
                Src.splice(Srclen, 1);
            }
        }
        this.basketLV.DataSource = Src.map(LI => { return LI.Data; });

        let tagLIs: any[] = tags.map(Data => {
            return this.basketLV.createListItem(Data);
        });
        this.onDroppedTags.emit(tagLIs);

        this.loading = false;
    }

    private generateRequest() {
        this.errorsResponseToView = [];

        let request: ViewTagsSettings = {
            tags: this.DataSource.map(tag => tag.Data.TagId)
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
            this.router.navigate(['datapresentation/result']/*, { relativeTo: this.activateRoute }*/);
        }
    }

    compareData() {
        if (this.generateRequest()) {
            this.router.navigate(['datapresentation/comparetags']/*, { relativeTo: this.activateRoute }*/);
        }
    }

    onInitDateRange() {
        //сперва грузим из кеша
        this.loadDateRangeFromStorage();
        //если это вкладка теги компонента data-result, значит берем из настроек модуля
        this.loadDateRangeFromResultService();
    }

    loadDateRangeFromStorage() {
        let dateRange: any = localStorage.getItem(this.dateRangeLocalStorageName);
        if (dateRange) {
            dateRange = JSON.parse(dateRange);
            if (dateRange.fromDate) this.fromDate = dateRange.fromDate;
            if (dateRange.toDate) this.toDate = dateRange.toDate;
        }
    }

    loadDateRangeFromResultService() {
        if (this.PropertyForm.IsCompareData) {
            let settings = this.dataResultSettingsService.getSettings();
            if (settings.fromDate) this.minDate = this.fromDate = settings.fromDate;
            if (settings.toDate) this.maxDate = this.toDate = settings.toDate;
        }
    }
}