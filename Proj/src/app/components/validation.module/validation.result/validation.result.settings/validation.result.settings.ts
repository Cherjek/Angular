import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

declare var $: any;

import { ValidationResultSettingService } from '../../../../services/validation.module/ValidationResultSetting.service';

@Component({
    selector: 'frame-validation-result-settings',
    templateUrl: 'validation.result.settings.html',
    styleUrls: ['validation.result.settings.css']
})

export class ValidationResultSettingsComponent implements OnInit, OnDestroy {

    constructor(
        private activateRoute: ActivatedRoute,
        private dsSettings: ValidationResultSettingService) {

        this.subscription = activateRoute.parent.params.subscribe(params => this.jobId = params['id']);
    }

    private subscription: Subscription;
    private jobId: string;
    public JobSettings: any = {
        Issues: []
    };
    errorsContentValidationForms: any[] = [];
    loadingContentPanel: boolean = true;

    ngOnInit() {
        this.loadData();
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private loadData(): void {
        this.dsSettings.get(this.jobId)
            .subscribe(
                (data) => {
                    this.loadingContentPanel = false;
                    this.JobSettings = data;
                },
                (error) => {
                    this.loadingContentPanel = false;
                    this.errorsContentValidationForms.push(error);
                }
            );
    }
}
