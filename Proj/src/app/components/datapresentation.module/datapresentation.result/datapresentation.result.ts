import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigateItem } from '../../../common/models/Navigate/NavigateItem';
import { ContextButtonItem } from '../../../controls/ContextButton/ContextButtonItem';
import { GlobalValues } from '../../../core';

import { DataResultSettingsService } from '../../../services/datapresentation.module/DataResultSettings.service';
import { ObjectUnitTagsService } from '../../../services/datapresentation.module/ObjectUnitTags.service';

declare var $: any;

@Component({
    selector: 'frame-datapresentation-result',
    templateUrl: 'datapresentation.result.html',
    styleUrls: ['datapresentation.result.css']
})

export class DatapresentationResultComponent implements OnInit, OnDestroy {

    //private loadingContentPanel: boolean = false;
    //private errorsContentValidationForms: any[] = [];

    GlobalValues = GlobalValues.Instance;
    Menu: NavigateItem[] = [
        {
            code: "data",
            url: "data",
            name: AppLocalization.Data
        },
        {
            code: "tags",
            url: "tags",
            name: AppLocalization.Tags
        }
    ];
    ContextButtonItems: ContextButtonItem[] = [
        {
            code: "validation",
            name: AppLocalization.StartAnalysis
        }
    ];

    constructor(
        private router: Router,
        private dataResultSettingsService: DataResultSettingsService,
        private objectUnitTagsService: ObjectUnitTagsService) {
    }

    ngOnInit() {
    }
    ngOnDestroy() {
        
    }

    contextButtonHeaderClick(item: any) {

        let settings = this.dataResultSettingsService.getSettings();

        let request = {
            tagIds: settings.tags,
            timestampStart: 0,
            timestampEnd: 0
        }

        let correctTime = (date: Date) => {
            return (new Date(date)).setUTCHours(date.getUTCHours());
        }

        if (settings.fromDate != null) {
            request.timestampStart = correctTime(settings.fromDate);
        }
        if (settings.toDate != null) {
            request.timestampEnd = correctTime(settings.toDate);
        }


        this.objectUnitTagsService
            .dataPresentService()
            .post(request.tagIds)
            .then(guid => {
                this.router.navigate(
                    ['validation/create'],
                    {
                        queryParams: {
                            'key': guid,
                            'startDate': request.timestampStart,
                            'endDate': request.timestampEnd
                        }
                    }
                );
            });
    }
}