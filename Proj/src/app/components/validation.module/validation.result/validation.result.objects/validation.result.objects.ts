import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

declare var $: any;

import { ValidationResultObjectsService } from '../../../../services/validation.module/ValidationResultObjects.service';
import { TreeListCheckedService } from '../../../../shared/rom-forms/treeList.checked.panel';

@Component({
    selector: 'frame-validation-result-objects',
    templateUrl: 'validation.result.objects.html',
    styleUrls: ['validation.result.objects.css']
})

export class ValidationResultObjectsComponent implements OnInit, OnDestroy {

    constructor(
        private activateRoute: ActivatedRoute,
        private dsObjects: ValidationResultObjectsService,
        public treeListCheckedService: TreeListCheckedService) {

        this.subscription = activateRoute.parent.params.subscribe(params => this.jobId = params['id']);
    }

    loadingContentPanel: boolean = true;
    errorsObjectsValidationForms: any[] = [];

    private subscription: Subscription;
    private jobId: string;
    public JobObjects: any[];
    public Nodes: any[];

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
                }
            );
    }
}
