import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

declare var $: any;

import { ReportResultObjectsService } from '../../../../services/reports.module/Result/ReportResultObjects.service';

import { ReportRepeatWithUnitsService } from '../../../../services/reports.module/ReportRepeatWithUnits.service';

import { ObjectsPanelComponent } from '../../../../shared/rom-forms';

import { TreeListCheckedService } from '../../../../shared/rom-forms/treeList.checked.panel';

@Component({
    selector: 'frame-reports-result-objects',
    templateUrl: 'reports.result.objects.html',
    styleUrls: ['reports.result.objects.css']
})

export class ReportResultObjectsComponent implements OnInit, OnDestroy {

    unitIds: any[] = [];
    loadingContentPanel = true;
    errorsObjectsValidationForms: any[] = [];
    JobObjects: any[];
    Nodes: any[];    
    changeDetection: string;
    
    @ViewChild('ObjectsPanel', { static: false }) private objectsPanel: ObjectsPanelComponent;
    @ViewChild('treePanel', { static: false }) private treePanel: any;

    private subscription: Subscription;
    private jobId: string;    

    constructor(
        private activateRoute: ActivatedRoute,
        private dsObjects: ReportResultObjectsService,
        private reportRepeatWithUnitsService: ReportRepeatWithUnitsService,
        private router: Router,
        public treeListCheckedService: TreeListCheckedService) {

        this.subscription = activateRoute.parent.params.subscribe(params => this.jobId = params['id']);
    }

    ngOnInit() {
        this.loadData();
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private loadData(): void {
        this.dsObjects.get(this.jobId)
            .subscribe(
                (data: any) => {
                    this.loadingContentPanel = false;
                    this.JobObjects = data.JobObjects;
                    this.Nodes = data.Nodes;
                }, (error) => {
                    this.loadingContentPanel = false;
                    this.errorsObjectsValidationForms.push(error);
                }
            );
    }

    enableFooterButtons(event: any) {
        this.unitIds = event.sender.getSelectedRows().map((unit: any) => unit.IdLogicDevice);        
    }

    selectLogicDevices(value: any) {
        if (this.treePanel.mapTreeLevel.has(1)) {
            const itemsList = this.treePanel.mapTreeLevel.get(1);
            if (itemsList) {
                const checkItemsList = itemsList.filter((x: any) => x.IsCheck);
                if (checkItemsList.length) {
                    this.unitIds = checkItemsList.map((i: any) => i.Data.Id);
                } else {
                    this.unitIds = [];
                }
            }
        }        
    }

    repeatWithUnits() {
        this.loadingContentPanel = true;
        this.reportRepeatWithUnitsService.post({ReportId: this.jobId, UnitsId: this.unitIds})
            .then(() => {
                this.loadingContentPanel = false;
                this.router.navigate(['/reports/queue']);
            }, (error) => {
                this.loadingContentPanel = false;
                this.errorsObjectsValidationForms.push(error);
            });
    }

    cancel() {
        if (this.objectsPanel) {
            this.objectsPanel.listView.DataSource = this.JobObjects;
        } else if (this.treePanel) {
            const nodeClone = JSON.stringify(this.Nodes);
            this.Nodes = null;
            setTimeout(() => {
                this.Nodes = JSON.parse(nodeClone);
            });
        }
        this.unitIds = [];
    }
}
