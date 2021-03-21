import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    ScheduleStep,
    ScheduleStepService,
    IScheduleStep,
    ScheduleStepType,
    IScheduleStepRequest,
    IDateTimeDepthType,
    IDateTimeDepth,
    DataQueryTypeTags,
    IEMailRecipient,
    EMailRecipient
} from 'src/app/services/schedules.module';
import { forkJoin, Observable, pipe, of } from 'rxjs';
import { finalize, delay } from 'rxjs/operators';
import { GlobalValues, Utils } from 'src/app/core';
import { IData } from 'src/app/services/data-query';

@Component({
    selector: 'rom-step-reports',
    templateUrl: './step-reports.component.html',
    styleUrls: ['./step-reports.component.less'],
    providers: [ScheduleStepService]
})
export class StepReportsComponent implements OnInit {

    validEmailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    loadingContentPanel = true;
    errors: any[] = [];
    idSchedule: number;
    idStep: number | string;
    idStepType: number;
    scheduleStep: IScheduleStepRequest;
    datetimeDepthTypes: IDateTimeDepthType[];
    reports: IData[];
    emails: IEMailRecipient[];
    typesDateRange = [
        { Id: 'Default', Name: AppLocalization.Default }, 
        { Id: 'Dynamic', Name: AppLocalization.Dynamically }, 
        { Id: 'Static', Name: AppLocalization.Statically }
    ];
    get typeDateRange(): IData {
        if (this.scheduleStep != null) {
            switch(this.scheduleStep.BuildReport.DateRange.DateRangeType) {
                case 'Default': return this.typesDateRange[0] as any;
                case 'Dynamic': return this.typesDateRange[1] as any;
                case 'Static': return this.typesDateRange[2] as any;
            }
        }
        return null;
    }

    get reportsView(): string[] {
        if (this.reports) {
            return this.reports.map(x => x.Name);
        }
        return null;
    }

    get emailsView(): string[] {
        if (this.emails) {
            return this.emails.map(x => this.patternEmail(x));
        }
        return null;
    }

    get isNew() {
        return this.idStep === 'new';
    }

    @ViewChild('reportsChips', { static: false }) reportsChips: any;
    @ViewChild('emailsChips', { static: false }) emailsChips: any;

    constructor(
        private scheduleStepService: ScheduleStepService,
        private activateRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.idSchedule = this.activateRoute.snapshot.params.id;
        this.idStep = this.activateRoute.snapshot.params.idStep;
        this.idStepType = this.activateRoute.snapshot.params.idStepType;

        this.loadData();
    }

    @HostListener('document:keydown', ['$event']) onKeyDownFilter(event: KeyboardEvent) {
        if (event.ctrlKey) {
            // Ctrl + s = save
            if (event.keyCode === 83) {
                event.preventDefault();
                this.save();
            }
        } else {
            if (event.keyCode === 27) {
                this.cancel();
            }
        }
    }

    private patternEmail(email: IEMailRecipient) {
        return `${email.EMail}` + (email.Name ? ` (${email.Name})` : '');
    }

    private loadData() {
        
        let stepService;
        if (this.isNew) {
            stepService = this.scheduleStepService
                              .getNewScheduleStep(this.idSchedule, this.idStepType);
        } else {
            stepService = this.scheduleStepService
                              .getScheduleStep(this.idSchedule, this.idStep as number);
        }

        forkJoin(stepService,
                 this.scheduleStepService.getReportTypes(),
                 this.scheduleStepService.getEmailRecipients(),
                 this.scheduleStepService.getDatetimeDepthTypes())
            .pipe(
                finalize(() => {

                    of()
                        .pipe(
                            delay(1000),
                            finalize(() => { 
                                if (this.scheduleStep.BuildReport.ReportTypes &&
                                    this.scheduleStep.BuildReport.ReportTypes.length) {
                                        this.reportsChips.chips = this.scheduleStep.BuildReport.ReportTypes.map(x => x.Name);
                                    }

                                if (this.scheduleStep.BuildReport.EMailRecipients &&
                                    this.scheduleStep.BuildReport.EMailRecipients.length
                                    && this.emailsChips) {
                                        this.emailsChips.chips = 
                                            this.scheduleStep.BuildReport.EMailRecipients.map(x => this.patternEmail(x));
                                    }

                                this.checkedEmails();

                                this.loadingContentPanel = false;
                            })
                        )
                        .subscribe();
                })
            )
            .subscribe(
                (results: any[]) => {
                    this.scheduleStep = results[0] as IScheduleStepRequest;
                    this.reports = results[1] as IData[];
                    this.emails = results[2] as IEMailRecipient[];
                    this.datetimeDepthTypes = results[3] as IDateTimeDepthType[];
                },
                (error) => this.errors = [error]
            );
    }

    private checkedEmails() {
        
    }

    save() {
        this.errors = [];
        
        let emailsRequest: IEMailRecipient[];
        const reportsRequest: IData[] = [];

        const reports: string[] = this.reportsChips.chips;
        reports.forEach(rc => {
            const compare = (s1: string, s2: string) => {
                const val = s1.toLowerCase().startsWith(s2.toLowerCase());
                return val;
            }
            const report = this.reports.find(r => compare(r.Name, rc));
            if (report) {
                reportsRequest.push(report);
            }
        });
        if (!reportsRequest.length) {
            this.errors.push(AppLocalization.NotChooseReports);
        }

        if (this.scheduleStep.BuildReport.SendByEMail) {
            const emails: string[] = this.emailsChips.chips;

            const compareEmail = (e1: IEMailRecipient, e2: string) => {
                return this.patternEmail(e1).toLowerCase().startsWith(e2.toLowerCase());
            }
            emailsRequest = this.emails.filter(e => emails.find(ec => compareEmail(e, ec)) != null);
            const emailsNew = emails.filter(ec => ec.indexOf('(') < 0 && emailsRequest.find(e => compareEmail(e, ec)) == null)
                                    .map(e => {
                                        const email = new EMailRecipient();
                                        email.RecipientType = 'Custom';
                                        email.EMail = e;
                                        return email;
                                    });
            const oldEmails = emails.filter(ec => ec.indexOf('(') > 0);
            const __ = this.scheduleStep.BuildReport.EMailRecipients.filter(e => e.RecipientType === 'Custom' && oldEmails.find(ec => compareEmail(e, ec)) != null);
            const result = [...new Set(__.map(x => x.EMail))]
                .map(email => __.find(e => e.EMail === email));
            emailsRequest = emailsRequest.concat([...emailsNew, ...result]);
            if (!(emailsRequest || []).length) {
                this.errors.push(AppLocalization.NotDefineEmail);
            }
        }

        if (this.scheduleStep.BuildReport.DateRange.DateRangeType === 'Dynamic' &&
            (this.scheduleStep.BuildReport.DateRange.DateTimeDepth.Type == null
                || !this.scheduleStep.BuildReport.DateRange.DateTimeDepth.DepthValue)) {
            this.errors.push(AppLocalization.Label6);
        }

        if (this.errors.length) return;

        this.loadingContentPanel = true;
        
        if (this.scheduleStep.BuildReport.DateRange.DateRangeType === 'Default'
            || this.scheduleStep.BuildReport.DateRange.DateRangeType === 'Static') {
            this.scheduleStep.BuildReport.DateRange.DateTimeDepth.Type = null;
            this.scheduleStep.BuildReport.DateRange.DateTimeDepth.DepthValue = 0;
        }
        if (this.scheduleStep.BuildReport.DateRange.DateRangeType === 'Default'
            || this.scheduleStep.BuildReport.DateRange.DateRangeType === 'Dynamic') {
            this.scheduleStep.BuildReport.DateRange.StartDate = null;
            this.scheduleStep.BuildReport.DateRange.EndDate = null;
        }

        if (this.scheduleStep.BuildReport.DateRange.DateRangeType === 'Static') {
            this.scheduleStep.BuildReport.DateRange.StartDate = 
                Utils.DateConvert.toDateTimeRequest(this.scheduleStep.BuildReport.DateRange.StartDate);
            this.scheduleStep.BuildReport.DateRange.EndDate = 
                Utils.DateConvert.toDateTimeRequest(this.scheduleStep.BuildReport.DateRange.EndDate);
        }

        this.scheduleStep
            .BuildReport
            .ReportTypes = reportsRequest;

        if (this.scheduleStep.BuildReport.SendByEMail) {
            this.scheduleStep
                .BuildReport
                .EMailRecipients = emailsRequest;
        }

        this.scheduleStepService
            .setScheduleStep(this.idSchedule, this.scheduleStep)
            .then((result: any) => {
                this.cancel();
            })
            .catch((error: any) => {
                this.loadingContentPanel = false;
                this.errors = [error];
            });
    }

    cancel() {
        if (this.isNew) {
            GlobalValues.Instance.Page.backwardButton.popLastUrl();
        }
        GlobalValues.Instance.Page.backwardButton.navigate();
    }
}
