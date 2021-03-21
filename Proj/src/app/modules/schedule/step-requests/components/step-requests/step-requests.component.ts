import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IQueryTypeTags } from 'src/app/services/data-query';
import { QueryTypeTagsComponent } from 'src/app/modules/requests/shared/components/query-type-tags/query-type-tags.component';
import {
    ScheduleStep,
    ScheduleStepService,
    IScheduleStep,
    ScheduleStepType,
    IScheduleStepRequest,
    IDateTimeDepthType,
    IDateTimeDepth,
    DataQueryTypeTags
  } from 'src/app/services/schedules.module';
import { forkJoin, Observable, pipe, of } from 'rxjs';
import { finalize, delay } from 'rxjs/operators';
import { GlobalValues, Utils } from 'src/app/core';
import { AppLocalization } from 'src/app/common/LocaleRes';

@Component({
    selector: 'rom-step-requests',
    templateUrl: './step-requests.component.html',
    styleUrls: ['./step-requests.component.less'],
    providers: [ScheduleStepService]
})
export class StepRequestsComponent implements OnInit {

    loadingContentPanel = true;
    errors: any[] = [];
    queryTypeTags: IQueryTypeTags[];
    formEditItems: any;
    idSchedule: number;
    idStep: number | string;
    idStepType: number;
    scheduleStep: IScheduleStepRequest;
    datetimeDepthTypes: IDateTimeDepthType[];
    // 1 - dynamic, 2 - static
    @ViewChild('queryTypeTagsControl', { static: false }) queryTypeTagsControl: QueryTypeTagsComponent;


    constructor(
        private scheduleStepService: ScheduleStepService,
        private activateRoute: ActivatedRoute) { }

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

    get isNew() {
        return this.idStep === 'new';
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
                 this.scheduleStepService.getQueryTags(this.idSchedule),
                 this.scheduleStepService.getDatetimeDepthTypes())
            .pipe(
                finalize(() => {
                    
                        of()
                            .pipe(
                                delay(1000),
                                finalize(() => { 
                                    
                                    if (this.scheduleStep.DataQuery.DataQueryTypeTags != null && 
                                        this.scheduleStep.DataQuery.DataQueryTypeTags.length) { 

                                            this.scheduleStep.DataQuery.DataQueryTypeTags.forEach(
                                                dq => {
                                                    const qt = this.queryTypeTags.find(qt => qt.QueryType.Code === dq.QueryType);
                                                    if (qt) {
                                                        this.queryTypeTagsControl.formEditItems[qt.QueryType.Id] = {
                                                            edit: false
                                                        };
                                                        qt.AllTagCodes = dq.AllTagCodes;
                                                        if (!qt.AllTagCodes) {
                                                            this.queryTypeTagsControl.formEditItems[qt.QueryType.Id].tags = 
                                                                qt.TagCodes.filter(qtt => dq.TagCodes.find(tc => tc === qtt.Code) != null);
                                                        }
                                                    }
                                                }
                                            );

                                        }
                                    
                                    this.loadingContentPanel = false;
                                })
                            )
                            .subscribe();
                    
                })
            )
            .subscribe(
                (results: any[]) => {
                    this.scheduleStep = results[0] as IScheduleStepRequest;
                    this.queryTypeTags = results[1] as IQueryTypeTags[];
                    this.datetimeDepthTypes = results[2] as IDateTimeDepthType[];
                },
                (error) => this.errors = [error]
            );
    }

    save() {
        
        this.errors = [];
        
        const queryTypeTags = this.queryTypeTags.filter(qtt => qtt.AllTagCodes);
        this.queryTypeTags
            .filter(qtt => !qtt.AllTagCodes)
            .forEach(qtt => {
                const formItemSave = this.queryTypeTagsControl.formEditItems[qtt.QueryType.Id];
                if (formItemSave && formItemSave.tags) {
                    const queryTypeTag = { ...qtt };
                    queryTypeTag.TagCodes = formItemSave.tags.map((t: any) => ({ ...t }));
                    queryTypeTags.push(queryTypeTag);
                }
            });
        this.scheduleStep.DataQuery.DataQueryTypeTags = queryTypeTags.map(x => {
            const dataQuery = new DataQueryTypeTags();
            dataQuery.QueryType = x.QueryType.Code;
            dataQuery.AllTagCodes = x.AllTagCodes;
            if (!dataQuery.AllTagCodes) {
                dataQuery.TagCodes = x.TagCodes.map(y => y.Code);
            }
            return dataQuery;
        });

        if (this.scheduleStep.DataQuery.DateRange.DateRangeType === 'Dynamic' &&
            (this.scheduleStep.DataQuery.DateRange.DateTimeDepth.Type == null
                || !this.scheduleStep.DataQuery.DateRange.DateTimeDepth.DepthValue)) {
            this.errors.push(AppLocalization.Label5);
        }

        if (this.errors.length) return;
        
        this.loadingContentPanel = true;

        if (this.scheduleStep.DataQuery.DateRange.DateRangeType === 'Static') {
            this.scheduleStep.DataQuery.DateRange.StartDate = 
                Utils.DateConvert.toDateTimeRequest(this.scheduleStep.DataQuery.DateRange.StartDate);
            this.scheduleStep.DataQuery.DateRange.EndDate = 
                Utils.DateConvert.toDateTimeRequest(this.scheduleStep.DataQuery.DateRange.EndDate);
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
