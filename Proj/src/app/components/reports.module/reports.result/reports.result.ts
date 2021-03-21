import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigateItem } from '../../../common/models/Navigate/NavigateItem';
import { ReportResultDataService } from '../../../services/reports.module/Result/ReportResultData.service';
import { ReportQueueService } from '../../../services/reports.module/ReportQueue.service';
import { DownloadFileService } from '../../../services/reports.module/DownloadFile.service';
import { ContextButtonItem } from '../../../controls/ContextButton/ContextButtonItem';
import { GlobalValues, PermissionCheck } from '../../../core';

@Component({
    selector: 'app-report.result',
    templateUrl: 'reports.result.html',
    styleUrls: ['reports.result.css']
})
export class ReportsResultComponent implements OnInit, OnDestroy {
    public isRepeatStart = false;
    public loadingContentPanel = false;
    public errorsContentValidationForms: any[] = [];
    public subscription: Subscription;
    public jobId: string;
    public JobInfo: any = {};
    public Hierarchy: any;
    private get IsDisabledDownload() {
        return !this.JobInfo.IsFinished && !this.isRepeatStart;
    }
    private get IsDisabledRepeat() {
        return !this.JobInfo.IsEndState && !this.isRepeatStart;
    }
    Menu: NavigateItem[] = [
        {
            code: 'log',
            url: 'log',
            name: AppLocalization.Log,
            access: 'DR_VIEW_LOG'
        },
        {
            code: 'objects',
            url: 'objects',
            name: AppLocalization.Label32
        }
    ];
    ContextButtonItems: ContextButtonItem[];

    constructor(public router: Router,
                public activateRoute: ActivatedRoute,
                public reportDataService: ReportResultDataService,
                public reportQueueService: ReportQueueService,
                public downloadFileService: DownloadFileService,
                private permissionCheck: PermissionCheck) {
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

    getMenu() {
        return this.Menu;
    }

    public loadData() {
        this.reportDataService.get(this.jobId).subscribe(
            (data: any) => {
                this.loadingContentPanel = false;
                this.JobInfo = (data || {}).Result.Job;
                this.Hierarchy = (data || {}).Hierarchy;
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
                code: 'download',
                name: AppLocalization.Label83,
            },
            {
                code: 'repeat',
                name: AppLocalization.TryAgain,
            }
        ];
        const user = GlobalValues.Instance.userApp.UserName;
        if (this.JobInfo.UserName !== user) {
            this.permissionCheck.checkAuthorization('DR_OTHER_USER_RESTART').toPromise().then(
                (response) => {
                    this.ContextButtonItems[0].isDisabled = this.IsDisabledDownload || !response;
                    this.ContextButtonItems[1].isDisabled = this.IsDisabledRepeat || !response;
                },
                () => {
                    this.ContextButtonItems[0].isDisabled = true;
                    this.ContextButtonItems[1].isDisabled = true;
                }
            );
        } else {
            this.ContextButtonItems[0].isDisabled = this.IsDisabledDownload;
            this.ContextButtonItems[1].isDisabled = this.IsDisabledRepeat;
        }
    }

    clickedTab(tab: number) {
        this.errorsContentValidationForms = [];
        this.loadingContentPanel = true;
        this.isRepeatStart = true;
        let promise: any;
        let fncComplete: any;
        if (tab === 1) {
            promise = this.reportQueueService.repeatAnalyze(this.jobId);
            fncComplete = () => {
                this.router.navigate(['reports/queue']);
            };
        }
        promise.then(
            (response: any) => {
                this.loadingContentPanel = false;
                this.isRepeatStart = false;

                fncComplete();
            },
            (error: any) => {
                this.loadingContentPanel = false;
                this.isRepeatStart = false;
                this.errorsContentValidationForms.push(error);
            }
        );
    }

    clickedDownload() {
        this.downloadFileService.loadFile(this.jobId).subscribe(
            (data: any) => {
                if (navigator.msSaveOrOpenBlob) {
                    navigator.msSaveOrOpenBlob(data.blob, data.fileName);
                } else {
                    const downloadLink = document.createElement('a');
                    const url = window.URL.createObjectURL(data.blob);
                    downloadLink.href = url;
                    downloadLink.download = data.fileName;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                }
            },
            (error: any) => {
                this.errorsContentValidationForms.push(error);
            }
        );
    }

    public contextButtonHeaderClick(code: string) {
        if (code === 'download') {
            this.clickedDownload();
        } else if (code === 'repeat') {
            this.clickedTab(1);
        }
    }
}
