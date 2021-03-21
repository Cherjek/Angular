import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
declare var $: any;

import { ValidationCreateSettingService } from '../../../services/validation.module/ValidationCreateSetting.service';
import { ValidationCreateTemplateService } from '../../../services/validation.module/ValidationCreateTemplate.service';
import { EquipmentService } from '../../../services/common/Equipment.service';

import * as Models from '../../../services/validation.module/Models/DataValidationCreateJobSetting';
import DataValidationCreateSetting = Models.Services.ValidationModule.Models.DataValidationCreateSetting;
import Issue = Models.Services.ValidationModule.Models.Issue;
import Tag = Models.Services.ValidationModule.Models.TagSettings;
import IssueTagSettings = Models.Services.ValidationModule.Models.IssueTagSettings;

import { ObjectsPanelComponent } from '../../../shared/rom-forms';
import { ViewTagsSettings } from '../../../services/datapresentation.module/Models/ViewTagsSettings';

import { TreeListCheckedService } from '../../../shared/rom-forms/treeList.checked.panel';
import { Utils, GlobalValues } from '../../../core';

@Component({
    selector: 'frame-validation-create',
    templateUrl: 'validation.create.html',
    styleUrls: ['validation.create.css']
})

export class ValidationCreateComponent implements OnInit, OnDestroy {

    loadingContentPanel: boolean = true;
    loadingRightPanel: boolean = true;

    private _fromDate: any;
    get fromDate(): any {
        return this._fromDate;
    }
    set fromDate(val: any) {
        this._fromDate = val;
    }
    private _toDate: any;
    get toDate(): any {
        return this._toDate;
    }
    set toDate(val: any) {
        this._toDate = val;
    }

    private Allowance: any = null;

    // DATA SOURCE
    JobSetting: any = {
        Issues: []
    }
    JobObjects: any[];
    Nodes: any[];

    // FORMS ITEM BINDINGS
    errorsContentValidationForms: any[] = [];
    errorsObjectsValidationForms: any[] = [];

    public isCreateValidSuccess = false;
    public isShowTemplateSavePanel = false;
    public isValidSaveTemplate = false;

    private urlParamsSubscribe: Subscription;
    private urlParams: any;
    private get isHierarchy() {
        return this.router.url.startsWith('/hierarchy');
    }
    public changeDetection: string;
    public basketHeaderMenu: string[];

    @ViewChild('ObjectsPanel', { static: false }) objectsPanel: ObjectsPanelComponent;
    
    constructor(
        public router: Router,
        public activateRoute: ActivatedRoute,
        public dataSource: ValidationCreateSettingService,
        public dataTemplateService: ValidationCreateTemplateService,
        public dsEquipment: EquipmentService,
        public treeListCheckedService: TreeListCheckedService,
        public utilsTree: Utils.UtilsTree) {

        this.urlParamsSubscribe = activateRoute.queryParams.subscribe(params => this.urlParams = params);
    }

    ngOnInit() {
        if (this.isHierarchy) {
            this.basketHeaderMenu = [GlobalValues.Instance.hierarchyApp.NodesName, AppLocalization.Label32];
        }

        this.loadData();
    }
    ngOnDestroy() {
        this.urlParamsSubscribe.unsubscribe();
    }

    back2Objects() {
        GlobalValues.Instance.Page.backwardButton.navigate();
    }

    private loadData(): void {
        this.dataSource.get()
            .subscribe(
                (data: any) => this.loadContent(data),
                (error) => {
                    this.loadingContentPanel = false;
                    this.errorsContentValidationForms.push(error);
                }
            );

        const errorFnc = (error: any) => {
            this.loadingRightPanel = false;
            this.errorsObjectsValidationForms.push(error);
        }
        if (this.isHierarchy) {
            const idHierarchy = this.activateRoute.snapshot.params.id;
            const key = this.activateRoute.snapshot.queryParams.key;
            this.dsEquipment.getForDataValidation(idHierarchy, key)
                .subscribe(
                    (data: any) => this.loadNodesContent(data),
                    (error: any) => errorFnc(error)
                );
        } else {
            this.dsEquipment.get(this.urlParams)
                .subscribe(
                    (data: any) => this.loadObjectsContent(data),
                    (error: any) => errorFnc(error)
                );
        }
    }
    // DATA FUNCTION
    private loadContent(data: any[]): void {
        if (data.length) {
            if (data[0].Issues) {
                (<any[]>data[0].Issues).forEach((item) => {

                    if (item.Code === "Mismatch") item.Caption = AppLocalization.ChoosedTagsCompare;
                    else item.Caption = (<string>item.Name).toUpperCase();
                    //if (item.Code === "Gap") item.Caption = "AppLocalization.ChoosedTagsCompare";
                    //if (item.Code === "GapMonth") item.Caption = "AppLocalization.ChoosedTagsCompare";
                    //if (item.Code === "OverConsumption") item.Caption = "AppLocalization.ChoosedTagsCompare";

                    if (item.Tags) {
                        (<any[]>item.Tags).forEach((tag) => {
                            tag.IsCheck = false;
                        });
                    }
                });
            }
        }
                
        if (data.length) {

            data[0].DateStart = new Date(new Date().setHours(0, 0, 0));
            data[0].DateEnd = new Date(new Date().setHours(0, 0, 0));
            (<Date>data[0].DateStart).setDate((<Date>data[0].DateStart).getDate() - 1);

            if (this.urlParams) {
                if (this.urlParams.startDate) data[0].DateStart = new Date(parseInt(this.urlParams.startDate));
                if (this.urlParams.endDate) data[0].DateEnd = new Date(parseInt(this.urlParams.endDate));
            }

            this.JobSetting = data[0];
        }

        if (this.urlParams.template) {
            this.loadTemplateSettings(this.urlParams.template);
        }
        else {
            this.loadingContentPanel = false;
        }
    }
    private loadNodesContent(data: any) {
        this.loadingRightPanel = false;
        this.Nodes = data;
    }
    private loadObjectsContent(data: any): void {
        this.loadingRightPanel = false;
        this.JobObjects = data;
    }
    private loadTemplateSettings(idTemplate: number) {
        this.dataTemplateService
            .get(idTemplate)
            .subscribe(
                (data: DataValidationCreateSetting | DataValidationCreateSetting[]) => {
                    let setting = <DataValidationCreateSetting>this.JobSetting;
                    setting.Allowance = (<DataValidationCreateSetting>data).Allowance;
                    ((<DataValidationCreateSetting>data).Issues || []).forEach((issue: Issue) => {
                        let __issue = (setting.Issues || []).find(x => x.Id === issue.Id);
                        if (__issue != null) {

                            (<any>__issue).IsCheck = (issue.Tags || []).length === (__issue.Tags || []).length;
                            if (!(<any>__issue).IsCheck) {
                                (<any>__issue).Indeterminate = (issue.Tags || []).length > 0 && (issue.Tags || []).length < (__issue.Tags || []).length;
                            }

                            (issue.Tags || []).forEach((tag: Tag) => {
                                let __tag: any = (__issue.Tags || []).find(x => x.Code === tag.Code);
                                if (__tag != null) {
                                    __tag.IsCheck = true;
                                    (tag.IssueTagSettings || []).forEach((tagSetting: IssueTagSettings) => {
                                        if (tagSetting.Value != null) {
                                            let __tagSetting = ((<Tag>__tag).IssueTagSettings || []).find(x => x.Code === tagSetting.Code);
                                            if (__tagSetting != null) {
                                                __tagSetting.Value = tagSetting.Value;
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });

                    this.loadingContentPanel = false;
                },
                (error) => {
                    this.loadingContentPanel = false;
                    this.errorsContentValidationForms.push(error);
                }
            );
    }


    //FORMS FUNCTION

    public isIssueEdit(issue: any): boolean {
        return this.saveIssue[issue.Id] != null;
    }

    private getDays(sd: any, ed: any): number {
        return Math.abs(Math.floor((ed.getTime() - sd.getTime()) / (1000 * 60 * 60 * 24)));
    }

    public getTagsChecked(issue: any): any {
        return (<any[]>(issue.Tags || [])).filter((tag) => tag.IsCheck);
    }

    private saveIssue: any = {};
    public onClickedAdd(issue: any): void {
        this.saveIssue[issue.Id] = JSON.stringify(issue);
    }
    public onClickedSave(issue: any): void {
        this.saveIssue[issue.Id] = null;
    }
    public onClickedCancel(issue: any): void {
        setTimeout(() => {
          if (issue && issue.Tags && issue.Tags.length) {
              if(issue.Tags.every((tag: any) => !tag.IsCheck)) {
                issue.IsCheck = false;
              } else if(issue.Tags.every((tag: any) => tag.IsCheck)) {
                  issue.IsCheck = true;
              } else if(issue.Tags.some((tag: any) => tag.IsCheck)) {
                  issue.IsCheck = false;
                  issue.Indeterminate = true;
              }
          }
        });
        let id = issue.Id;
        let _issue = <Issue>JSON.parse(this.saveIssue[id]);
        let findIssue = (<Issue[]>this.JobSetting.Issues).find(x => x.Id === id);
        if (findIssue) {
            findIssue.Tags = _issue.Tags;
        }
        this.saveIssue[id] = null;
    }
    public onClickedRemove(tag: any, event: any, item: any): void {
        tag.IsCheck = false;
        item.IsCheck = false;
    }
    public onTagValueChange(event: any, tag: any): void {
        let result = false;
        (tag.IssueTagSettings || []).forEach((data: any) => {
            result = result || !(!data.Value);
        });
        tag.IsCheck = result;
    }


    clickedAddToQueue(nameTemplate?: string): void {

        this.errorsContentValidationForms = [];
        this.errorsObjectsValidationForms = [];

        let units: any[] = [];
        const setting = <DataValidationCreateSetting>this.JobSetting;

        if (this.isHierarchy) {
            setting.ByHierarchy = true;
            setting.IdHierarchy = this.activateRoute.snapshot.params.id;
            units = this.Nodes
              .map(node => 
                node.LogicDevices
              )
              .reduce((list1, list2) => [...list1, ...list2])
              .sort((x: any, y: any) => x.Position - y.Position)
              .map((ld: any) => ld.Id);
        } else {
            (this.JobObjects || []).forEach(data => {
                units.push(data.IdLogicDevice);
            });
        }

        let isDateValid = setting.DateStart != null;
        let issues: any[] = [];
        let tags: any[];
        for (let i = 0; i < setting.Issues.length; i++) {
            let issue = setting.Issues[i];
            tags = [];
            tags = tags.concat(issue.Tags.filter((tag: any) => tag.IsCheck));

            if (tags.length) {
                let copyIssue = JSON.parse(JSON.stringify(issue));
                copyIssue.Tags = tags;
                issues.push(copyIssue);
            }
        }

        if (nameTemplate == null) {
            if (!isDateValid) this.errorsContentValidationForms.push(AppLocalization.Label49);
            if (!setting.JobName || setting.JobName == "") this.errorsContentValidationForms.push(AppLocalization.Label48);            
            if (!units.length) this.errorsObjectsValidationForms.push(AppLocalization.Label50);
        }
        if (!issues.length) this.errorsContentValidationForms.push(AppLocalization.Label46);
        if (this.errorsContentValidationForms.length === 0 && this.errorsObjectsValidationForms.length === 0) {

            this.loadingContentPanel = true;

            //преобразовываем инциденты к виду запроса
            issues.forEach((issue: any) => {
                issue.TagsView = issue.Tags;
                delete issue.Tags;
                if (issue.TagsView) {
                    issue.TagsView.forEach((tag: any) => {
                        tag.IssueTagSettingsView = tag.IssueTagSettings;
                        delete tag.IssueTagSettings;
                    });
                }
            });

            //отправка в бек
            let request: any = {
                Allowance: setting.Allowance,
                JobName: setting.JobName,
                DateStart: setting.DateStart,
                DateEnd: setting.DateEnd,
                ByHierarchy: setting.ByHierarchy,
                IdHierarchy: setting.IdHierarchy,
                IssuesView: issues,
                LogicDeviceIds: units
            }

            this.isCreateValidSuccess = true;

            if (nameTemplate == null) {
                this.dataSource.create(request).then((result: any) => {
                    //this.isCreateValidSuccess = true;
                    this.loadingContentPanel = false;
                    this.router.navigate(['validation/queue']/*, { relativeTo: this.activateRoute }*/);
                }, (error: any) => {
                    this.isCreateValidSuccess = this.loadingContentPanel = false;
                    this.errorsContentValidationForms.push(error.ShortMessage);
                });
            }
            else {

                request = {
                    nameTemplate: nameTemplate,
                    settings: request
                };

                this.dataTemplateService.post(request).then((result: any) => {
                    this.isShowTemplateSavePanel =
                        this.isCreateValidSuccess =
                        this.loadingContentPanel = false;
                    
                    }, (error: any) => {
                        this.isCreateValidSuccess = this.loadingContentPanel = false;
                        this.errorsContentValidationForms.push(error.ShortMessage);
                    });
            }
        }
    }

    private getDataSourceClone(data: any[]): any[] {
        return [...data].map(d => {
            const newNode = {...d};
            newNode.LogicDevices = [...d.LogicDevices];
            return newNode;
        });
    }

    removeListItems(items: any) {
        if (items.length) {
          this.Nodes = this.Nodes || [];
          const template = this.getDataSourceClone(this.Nodes);
          this.utilsTree.excludeTree(items, template, 'Id', 'LogicDevices');
          this.Nodes = template;
          this.changeDetection = (new Date()).getTime().toString();
        } else {
          this.Nodes = [];
        }

        if (this.Nodes == null || !this.Nodes.length) {
            this.back2Objects();
        }
    }
    onRemoveJobObjects(items: any) {
        this.JobObjects = items;

        if (items == null || !items.length) this.back2Objects();
    }

    clickCancelButton() {
        if (this.isShowTemplateSavePanel) {
          this.isShowTemplateSavePanel = false;
        }
        else {
          GlobalValues.Instance.Page.backwardButton.navigate();
        }
    }

    allTagsClick(item: any) {

        if (item.Indeterminate && !item.IsCheck) {
            item.Indeterminate = item.IsCheck = false;
        }
        else {
            item.IsCheck = !item.IsCheck;
        }

        ((<Issue>item).Tags || []).forEach((tag: any) => tag.IsCheck = item.IsCheck);
    }

    issueTagCheckChange(issue: Issue) {
        let tags = (issue.Tags || []);
        let tagsCheck = tags.filter((x: any) => x.IsCheck);

        (<any>issue).IsCheck = tagsCheck.length === tags.length;
        if (!(<any>issue).IsCheck) {
            (<any>issue).Indeterminate = tagsCheck.length > 0 && tagsCheck.length < tags.length;
        }
    }
}
