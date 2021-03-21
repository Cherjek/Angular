import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map, tap, finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import {
    HierarchyPropertyService,
    IHierarchyNodeTypePropertyCategory,
    HierarchyNodeTypePropertyCategory
} from '../../../../../services/additionally-hierarchies';
import { IEntityViewProperty } from 'src/app/services/common/Interfaces/IEntityViewProperty';

@Component({
    selector: 'property',
    templateUrl: './property.component.html',
    styleUrls: ['./property.component.less']
})
export class PropertyComponent implements OnInit, OnDestroy {

    public loadingContent: boolean;
    public errors: any[] = [];
    public properties: any[] = [];
    errorLoadEntity: any;

    private nodeTypePropertyCategory: IHierarchyNodeTypePropertyCategory;
    private idTypeNode: number;
    private idHierarchyNodeTypePropertyCategory: number | string;
    private subscription: Subscription;
    private subscriptionQuery: Subscription;

    public get isNew() {
        return this.idHierarchyNodeTypePropertyCategory === "new";
    }

    constructor(private hierarchyPropertyService: HierarchyPropertyService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
        this.subscription = this.activatedRoute.parent.params.subscribe(params => {
            this.idHierarchyNodeTypePropertyCategory = params['id'];
            
            this.subscriptionQuery = this.activatedRoute.queryParams.subscribe((qparams: any) => {
                this.idTypeNode = qparams['idTypeNode'];
                this.loadCategory();
            });
        });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.subscriptionQuery.unsubscribe();
    }

    private loadCategory() {
        this.loadingContent = true;
        const idTypeNode = this.idHierarchyNodeTypePropertyCategory === 'new' ? this.idTypeNode : null;
        this.hierarchyPropertyService.getHierarchyNodeTypePropertyCategory(this.idHierarchyNodeTypePropertyCategory, idTypeNode)
            .pipe(
                finalize(() => {
                    this.loadingContent = false;
                })
            )
            .subscribe(
                (data: IHierarchyNodeTypePropertyCategory) => {
                    this.nodeTypePropertyCategory = data;
                    this.initProperties(data);
                },
                (error: any) => {
                    this.errors = [error];
                    this.errorLoadEntity = error;
                }
            );
    }

    private initProperties(nodeTypePropertyCategory: IHierarchyNodeTypePropertyCategory) {
        const properties = [
            {
                Code: 'Name',
                Name: AppLocalization.Name,
                Type: 'String',
                Value: nodeTypePropertyCategory.Name,
                IsRequired: true
            }
        ];

        this.properties = properties;
    }

    save(properties: IEntityViewProperty[], propControl: any) {
        this.loadingContent = true;
        const nodeTypePropertyCategory = new HierarchyNodeTypePropertyCategory();
        if (!this.isNew) {
            nodeTypePropertyCategory.Id = this.idHierarchyNodeTypePropertyCategory as number;
        }
        nodeTypePropertyCategory.IdNodeType = this.idTypeNode;
        properties.forEach((prop: IEntityViewProperty) => {
            nodeTypePropertyCategory[prop.Code] = prop.Value;
        });
        this.hierarchyPropertyService
            .postNodeTypeCategoryProperty(nodeTypePropertyCategory)
            .then((idHierarchyNodeTypePropertyCategory: number) => {
                this.loadingContent = false;

                if (this.isNew) {
                    this.router.navigate(['../../../category-property-card/' + idHierarchyNodeTypePropertyCategory], {
                        preserveQueryParams: true,
                        relativeTo: this.activatedRoute
                    });
                } else {
                    this.loadCategory();
                }

                propControl.cancelChangeProperty();
            })
            .catch((error: any) => {
                this.loadingContent = false;
                this.errors = [error];
            });
    }
}
