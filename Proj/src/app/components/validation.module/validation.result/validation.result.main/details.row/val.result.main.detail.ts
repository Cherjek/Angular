import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { IDetailsComponent } from "../../../../../controls/ListComponentCommon/DetailsRow/IDetailsComponent";
import { ValidationResultTagsLDService } from '../../../../../services/validation.module/ValidationResultTagsLD.service';
import { Tag } from '../../../../../services/common/Models/Tag';
import { ViewTagsSettings } from '../../../../../services/datapresentation.module/Models/ViewTagsSettings';
import { DataResultSettingsService } from '../../../../../services/datapresentation.module/DataResultSettings.service';

@Component({
    selector: 'frame-validation-result-main-detail',
    templateUrl: 'val.result.main.detail.html',
    styleUrls: ['val.result.main.detail.css'],
    providers: [ValidationResultTagsLDService]
})
export class ValResultMainDetailComponent implements IDetailsComponent, OnInit, OnDestroy {

    parentKey: any;
    params: any;
    data: any;

    @Output() onLoadEnded = new EventEmitter<boolean>();

    errorsResponseToView: any[] = [];
    fromDate: any;
    toDate: any;
    chipsTags: Tag[];

    constructor(private validationResultTagsLDService: ValidationResultTagsLDService,
        private router: Router,
        private dataResultSettingsService: DataResultSettingsService) {

    }

    ngOnInit(): void {

        this.fromDate = this.data.DateStart;
        this.toDate = this.data.DateEnd;

        this.validationResultTagsLDService.get({ logicDeviceId: this.data.LogicDevice.Id, tags: [] })
            .subscribe(
                (data) => {
                    this.chipsTags = (data || []).map((tag: any) => new Tag(tag.TagId, tag.TagName, tag.TagCode));
                    this.onLoadEnded.emit(true);
                },
                (error) => {
                    this.errorsResponseToView.push(error);
                    this.onLoadEnded.emit(true);
                }
            );
    }

    ngOnDestroy(): void {
        
    }

    public clickResponseToView(chips: any): void {
        this.errorsResponseToView = [];

        let selectChips: any[] = [];
        if (chips && chips.length) {
            selectChips = (this.chipsTags || []).filter((tag: any) => {
                return chips.find((c: string) => c.indexOf(tag.Code) >= 0) != null;
            });
        }

        let request: ViewTagsSettings = {
            tags: selectChips.map((tag: any) => tag.Id),
            fromDate: this.fromDate,
            toDate: this.toDate
        }

        // if (!request.tags.length) this.errorsResponseToView.push('Не выбраны теги!');
        if (!request.fromDate) this.errorsResponseToView.push(AppLocalization.NoDateSelected);

        if (!this.errorsResponseToView.length) {
            this.dataResultSettingsService.setSettings(request);
            this.router.navigate(['datapresentation/result/data']);
        }
    }

    public getItemsInput(): any[] {
        return (this.chipsTags || []).map(t => t.Code + ' ' + t.Name);
    }
}