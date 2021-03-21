import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigateItem } from '../../../common/models/Navigate/NavigateItem';
import { ValidationResultInfoService } from '../../../services/validation.module/ValidationResultInfo.service';
import { ValidationJobService } from '../../../services/validation.module/ValidationJob.service';
import { ContextButtonItem } from '../../../controls/ContextButton/ContextButtonItem';
import { GlobalValues, PermissionCheck } from '../../../core';

@Component({
    selector: 'frame-validation-result',
    templateUrl: 'validation.result.html',
    styleUrls: ['validation.result.css']
})
export class ValidationResultComponent implements OnInit, OnDestroy {
    public loadingContentPanel = false;
    public errorsContentValidationForms: any[] = [];
    public isRepeatStart = false;
    public isJobInfoDefined: boolean;
    public subscription: Subscription;
    public jobId: string;
    public JobInfo: any = {};
    private get IsDisabledRepeat() {
        return !(this.JobInfo.Job || {}).IsEndState && !this.isRepeatStart;
    }
    private get IsDisabledRepeatIfNotIssue() {
        return !((this.JobInfo.Job || {}).IsFinished && (this.JobInfo || {}).IssueLength > 0) && !this.isRepeatStart;
    }
    Menu: NavigateItem[] = [
        {
            code: 'main',
            url: 'main',
            name: AppLocalization.Result,
            isVisible: false
        },
        {
            code: 'log',
            url: 'log',
            name: AppLocalization.Log,
            access: 'DA_VIEW_LOG'
        },
        {
            code: 'objects',
            url: 'objects',
            name: AppLocalization.Label32
        },
        {
            code: 'settings',
            url: 'settings',
            name: AppLocalization.Options
        }
    ];
    ContextButtonItems: ContextButtonItem[];

    constructor(
        public router: Router,
        public activateRoute: ActivatedRoute,
        public dsJob: ValidationJobService,
        public dsInfo: ValidationResultInfoService,
        public permissionCheck: PermissionCheck) {
        this.subscription = activateRoute.params.subscribe((params) => {
            this.jobId = params.id;
        });
    }

    ngOnInit() {
        this.loadData();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    public loadData(): void {
        this.dsInfo.get(this.jobId).subscribe(
            (data: any) => {
                this.JobInfo = data.Result;
                const menu = this.Menu.find(f => f.code === 'main');
                menu.isVisible = data.Result.Job.IsFinished;
                this.isJobInfoDefined = true;
                this.createContextButtonItems();
            },
            (error: any) => {
                this.loadingContentPanel = false;
                this.errorsContentValidationForms.push(error.ShortMessage + ': ' + error.Message);
            }
        );
    }

    public createContextButtonItems() {
        this.ContextButtonItems = [
            {
                code: 'repeatOnlyError',
                name: AppLocalization.RepeatAnalysisOnlyForFoundErrors,
            },
            {
                code: 'repeat',
                name: AppLocalization.RepeatTheAnalysisInFull,
            }
        ];
        const user = GlobalValues.Instance.userApp.UserName;
        if (this.JobInfo.Job.UserName !== user) {
            this.permissionCheck.checkAuthorization('DA_OTHER_USER_RESTART').toPromise().then(
                (response) => {
                    this.ContextButtonItems[0].isDisabled = this.IsDisabledRepeatIfNotIssue || !response;
                    this.ContextButtonItems[1].isDisabled = this.IsDisabledRepeat || !response;
                },
                () => {
                    this.ContextButtonItems[0].isDisabled = true;
                    this.ContextButtonItems[1].isDisabled = true;
                }
            );
        } else {
            this.ContextButtonItems[0].isDisabled = this.IsDisabledRepeatIfNotIssue;
            this.ContextButtonItems[1].isDisabled = this.IsDisabledRepeat;
        }
    }

    public clickedRepeat(withError: boolean = false): void {
        this.errorsContentValidationForms = [];
        this.loadingContentPanel = true;
        this.isRepeatStart = true;
        let promise: any;
        if (!withError) {
            promise = this.dsJob.repeatAnalyze(this.jobId);
        } else {
            promise = this.dsJob.repeatAnalyzeError(this.jobId);
        }
        promise.then(
            (result: any) => {
                this.isRepeatStart = false;
                this.loadingContentPanel = false;
                this.router.navigate(['validation/queue']);
            },
            (error: any) => {
                this.isRepeatStart = false;
                this.loadingContentPanel = false;
                this.errorsContentValidationForms.push(error.ShortMessage + ': ' + error.Message);
            });
    }

    public contextButtonHeaderClick(code: string) {
        if (code === 'repeat') {
            this.clickedRepeat();
        } else if (code === 'repeatOnlyError') {
            this.clickedRepeat(true);
        }
    }
}
