import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { EquipmentService } from '../../../../../services/common/Equipment.service';
import { DateTimeRange, DateTimeRangeType } from '../../../../../services/common/Models/DateTimeRange';
import { IHierarchyNodeView } from '../../../../../services/additionally-hierarchies';
import {
    DataQueryService, IQueryTypeTags,
    ILogicDeviceTagTypeInfo,
    DataQueryParameters,
    IDataQueryParameters
} from '../../../../../services/data-query';
import { TreeListCheckedService } from '../../../../../shared/rom-forms/treeList.checked.panel';
import { Utils, GlobalValues } from '../../../../../core';
import { DatePicker } from '../../../../../controls/DatePicker/DatePicker';
import { QueryTypeTagsComponent } from '../../../shared/components/query-type-tags/query-type-tags.component';

@Component({
    selector: 'rom-request-create',
    templateUrl: './request-create.component.html',
    styleUrls: ['./request-create.component.less'],
    providers: [EquipmentService]
})
export class RequestCreateComponent implements OnInit {

    loadingContentPanel = false;
    loadingRightPanel = true;
    errorsRightPanel: any[] = [];
    errors: any[] = [];
    nodes: IHierarchyNodeView[];
    queryTypeTags: IQueryTypeTags[];
    basketHeaderMenu: string[];
    changeDetection: string;
    isCreateValidSuccess = false;
    isShowTemplateSavePanel = false;
    isValidSaveTemplate = false;
    dateStart: string | Date;
    dateEnd: string | Date;
    jobName: string;
    
    @ViewChild('calendarSettings', { static: false }) calendar: DatePicker;
    @ViewChild('queryTypeTagsControl', { static: false }) queryTypeTagsControl: QueryTypeTagsComponent;

    constructor(
        private equipmentService: EquipmentService,
        private router: Router,
        private activateRoute: ActivatedRoute,
        private dataQueryService: DataQueryService,
        public treeListCheckedService: TreeListCheckedService,
        public utilsTree: Utils.UtilsTree) { }

    ngOnInit() {
        this.basketHeaderMenu = [GlobalValues.Instance.hierarchyApp.NodesName, AppLocalization.Label32];

        this.loadData();
    }

    removeListItems(items: any) {
        if (items.length) {
          this.nodes = this.nodes || [];
          const template = this.getDataSourceClone(this.nodes);
          this.utilsTree.excludeTree(items, template, 'Id', 'LogicDevices');
          this.nodes = template;
          this.changeDetection = (new Date()).getTime().toString();
        } else {
          this.nodes = [];
        }
        if (this.nodes == null || !this.nodes.length) {
            this.back2Objects();
        }
    }

    clickCancelButton() {
        if (this.isShowTemplateSavePanel) {
            this.isShowTemplateSavePanel = false;
        } else {
            this.back2Objects();
        }
    }

    clickedAddToQueue(templateName?: string) {

        this.errors = [];
        this.errorsRightPanel = [];

        const idHierarchy = this.activateRoute.snapshot.params.id;

        if (this.nodes == null || !this.nodes.length) {
            this.errorsRightPanel = [AppLocalization.NoEquipment];
            return;
        }

        const dateTimeRange = new DateTimeRange();
        dateTimeRange.Start = Utils.DateConvert.toDateTimeRequest(this.dateStart);
        dateTimeRange.End = Utils.DateConvert.toDateTimeRequest(this.dateEnd);
        dateTimeRange.RangeType =
            !this.calendar.fastButtonType ? DateTimeRangeType.None :
                this.calendar.fastButtonType === 1 ? DateTimeRangeType.LastDay :
                    this.calendar.fastButtonType === 2 ? DateTimeRangeType.LastWeek :
                        this.calendar.fastButtonType === 3 ? DateTimeRangeType.LastThirtyDays :
                            this.calendar.fastButtonType === 4 ? DateTimeRangeType.LastMonth : DateTimeRangeType.None;

        const request = new DataQueryParameters();
        request.IdHierarchy = idHierarchy;
        request.Name = this.jobName;
        request.DateTimeRange = dateTimeRange;
        request.LogicDevices =
            this.nodes
                .map(node => 
                  node.LogicDevices
                )
                .reduce((list1, list2) => [...list1, ...list2])
                .sort((x: any, y: any) => x.Position - y.Position)
                .map((ld: any) => ld.Id);

        const queryTypeTags = this.queryTypeTags.filter(qtt => qtt.AllTagCodes);
        this.queryTypeTags
            .filter(qtt => !qtt.AllTagCodes)
            .forEach(qtt => {
                const formItemSave = this.queryTypeTagsControl.formEditItems[qtt.QueryType.Id];
                if (formItemSave && formItemSave.tags && formItemSave.tags.length) {
                    const queryTypeTag = { ...qtt };
                    queryTypeTag.TagCodes = formItemSave.tags.map((t: any) => ({ ...t }));
                    queryTypeTags.push(queryTypeTag);
                }
            });
        request.QueryTypeTags = queryTypeTags;

        if (queryTypeTags == null || !queryTypeTags.length) {
            this.errors = [AppLocalization.TypesOfRequestsNotSelected];
        }

        if (this.errors.length) {
            return;
        }

        this.loadingContentPanel = true;

        let service;
        let callback = () => { };
        if (templateName != null) {
            request.LogicDevices = null;
            service = this.dataQueryService.createQueryTemplate(templateName, request);
            callback = () => {
                this.loadingContentPanel =
                    this.isShowTemplateSavePanel = false;
            };
        } else {
            service = this.dataQueryService.setDataQueryTypes(request);
            callback = () => {
                this.router.navigate(['requests-module/requests-queue']);
            };
        }

        service
            .then((result: any) => {
                callback();
            })
            .catch((error: any) => {
                this.loadingContentPanel = false;
                this.errors = [error];
            });
    }

    

    private getDataSourceClone(data: IHierarchyNodeView[]): IHierarchyNodeView[] {
        return [...data].map(d => {
            const newNode = { ...d };
            newNode.LogicDevices = [...d.LogicDevices];
            return newNode;
        });
    }

    private loadData() {
        this.loadingRightPanel = true;
        const idHierarchy = this.activateRoute.snapshot.params.id;
        const key = this.activateRoute.snapshot.queryParams.key;
        this.equipmentService
            .getForRequestModule(idHierarchy, key)
            .pipe(
                finalize(() => this.loadingRightPanel = false)
            )
            .subscribe(
                (data: IHierarchyNodeView[]) => {
                    this.nodes = data;
                    if (data && data.length) {
                        const ids = data.map(d => d.LogicDevices.map(ld => ld.Id))
                            .reduce((d1, d2) => [...d1, ...d2]);
                        this.loadTypesRequest(key, ids);
                    }
                },
                (error: any) => this.errorsRightPanel = [error]
            );
    }

    private mergeParamsFromTemplate(dataQueryParams: IDataQueryParameters) {
        if (dataQueryParams.DateTimeRange != null) {
            this.dateStart = dataQueryParams.DateTimeRange.Start;
            this.dateEnd = dataQueryParams.DateTimeRange.End;
            this.calendar.fastButtonType = dataQueryParams.DateTimeRange.RangeType;
        }
        this.jobName = dataQueryParams.Name;
        if (dataQueryParams.QueryTypeTags != null) {
            this.queryTypeTags.forEach(
                qt => {
                    const findItem = dataQueryParams.QueryTypeTags.find(qtt => qtt.QueryType.Id === qt.QueryType.Id);
                    if (findItem != null) {
                        this.queryTypeTagsControl.formEditItems[qt.QueryType.Id] = {
                            edit: false
                        };

                        qt.AllTagCodes = findItem.AllTagCodes;
                        if (!qt.AllTagCodes) {
                            this.queryTypeTagsControl.formEditItems[qt.QueryType.Id].tags = findItem.TagCodes;
                        }
                    }
                }
            );
        }
    }

    private loadTypesRequest(key: string, ids: number[]) {
        this.loadingContentPanel = true;
        this.dataQueryService
            .getDataQueryTypes(key)
            .pipe(
                finalize(() => {
                    const template = this.activateRoute.snapshot.queryParams.template;
                    if (template != null) {
                        this.dataQueryService
                            .getQueryTemplate(template)
                            .pipe(
                                finalize(() => this.loadingContentPanel = false)
                            )
                            .subscribe((dataQueryParams: IDataQueryParameters) => {
                                this.mergeParamsFromTemplate(dataQueryParams);
                            }, (error: any) => this.errors = [error])
                    } else {
                        this.loadingContentPanel = false;
                    }
                })
            )
            .subscribe(
                (data: IQueryTypeTags[]) => {
                    this.queryTypeTags = data;
                },
                (error: any) => this.errors = [error]
            );
    }

    private back2Objects() {
        GlobalValues.Instance.Page.backwardButton.navigate();
    }
}
