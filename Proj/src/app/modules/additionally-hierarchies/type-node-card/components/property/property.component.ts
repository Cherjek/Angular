import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map, tap, finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import {
    HierarchyPropertyService,
    NodeType
} from '../../../../../services/additionally-hierarchies';
import { IEntityViewProperty } from 'src/app/services/common/Interfaces/IEntityViewProperty';

@Component({
    selector: "property",
    templateUrl: './property.component.html',
    styleUrls: ['./property.component.less']
})
export class PropertyComponent implements OnInit, OnDestroy {
    public loadingContent: boolean;
    public errors: any[] = [];
    public errorLoadEntity: any;

    public properties: any = [];
    private nodeType: NodeType;
    private idHierarchy: number;
    private idNodeType: number | string;
    private subscription: Subscription;
    private subscriptionQuery: Subscription;

    public get isNew() {
        return this.idNodeType === 'new';
    }

    constructor(
        private hierarchyPropertyService: HierarchyPropertyService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.subscription = this.activatedRoute.parent.params.subscribe(params => {
            this.idNodeType = params['id'];

            this.subscriptionQuery = this.activatedRoute.queryParams.subscribe(
                (qparams: any) => {
                    this.idHierarchy = qparams['idHierarchy'];
                    this.loadNodeType();
                }
            );
        });
    }

    ngOnInit() { }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.subscriptionQuery.unsubscribe();
    }

    private loadNodeType() {
        this.loadingContent = true;
        const idHierarchy = this.idNodeType === 'new' ? this.idHierarchy : null;
        this.hierarchyPropertyService
            .getHierarchyNodeType(this.idNodeType, idHierarchy)
            .pipe(
                finalize(() => {
                    this.loadingContent = false;
                })
            )
            .subscribe(
                (data: NodeType) => {
                    this.nodeType = data;
                    this.initProperties(data);
                },
                (error: any) => {
                    this.errorLoadEntity = error;
                }
            );
    }

    private initProperties(nodeType: NodeType) {
        const properties = [
            {
                Code: 'Name',
                Name: AppLocalization.Name,
                Type: 'String',
                Value: nodeType.Name,
                IsRequired: true
            },
            {
                Code: 'Code',
                Name: AppLocalization.TypeCode,
                Type: 'String',
                Value: nodeType.Code,
                IsRequired: true
            },
            {
                Code: 'NodeName',
                Name: AppLocalization.TheNameOfTheSite,
                Type: 'String',
                Value: nodeType.NodeName,
                IsRequired: true
            },
            {
                Code: 'NodesName',
                Name: AppLocalization.NodeName,
                Type: 'String',
                Value: nodeType.NodesName,
                IsRequired: true
            },
            {
                Code: 'Description',
                Name: AppLocalization.Description,
                Type: 'String',
                Value: nodeType.Description
            }
        ];

        this.properties = properties;
    }

    public save(properties: IEntityViewProperty[], propControl: any) {
        this.loadingContent = true;
        const nodeType = new NodeType();
        if (!this.isNew) {
            nodeType.Id = this.idNodeType as number;
        }
        nodeType.IdHierarchy = this.idHierarchy;
        properties.forEach((prop: IEntityViewProperty) => {
            nodeType[prop.Code] = prop.Value;
        });
        this.hierarchyPropertyService
            .postNodeType(nodeType)
            .then((idNodeType: number) => {
                this.loadingContent = false;

                if (this.isNew) {
                    this.router.navigate(['../../../type-node-card/' + idNodeType], {
                        preserveQueryParams: true,
                        relativeTo: this.activatedRoute
                    });
                } else {
                    this.loadNodeType();
                }

                propControl.cancelChangeProperty();
            })
            .catch((error: any) => {
                this.loadingContent = false;
                this.errors = [error];
            });
    }
}
