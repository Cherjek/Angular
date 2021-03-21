import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map, tap, finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Observable, Observer } from 'rxjs/index';

import { HierarchyTypeEditorService,
    HierarchyPropertyService,
    IHierarchyNodeTypePropertyCategory,
    IHierarchyNodeTypePropertyType,
    HierarchyNodeTypePropertyType } from '../../../../../services/additionally-hierarchies';
import { IEntityViewProperty } from 'src/app/services/common/Interfaces/IEntityViewProperty';
import { IValueType } from 'src/app/services/common/Models/ValueType';

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

    private nodeTypePropertyType: IHierarchyNodeTypePropertyType;
    private idTypeNode: number;
    private idHierarchyNodeTypePropertyType: number | string;
    private subscription: Subscription;
    private subscriptionQuery: Subscription;

    public get isNew() {
        return this.idHierarchyNodeTypePropertyType === 'new';
    }

    constructor(private hierarchyTypeEditorService: HierarchyTypeEditorService,
                private hierarchyPropertyService: HierarchyPropertyService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
        this.subscription = this.activatedRoute.parent.params.subscribe(params => {
            this.idHierarchyNodeTypePropertyType = params.id;

            this.subscriptionQuery = this.activatedRoute.queryParams.subscribe((qparams: any) => {
                this.idTypeNode = qparams.idTypeNode;
                this.loadAdditionalProperty();
            });
        });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.subscriptionQuery.unsubscribe();
    }

    private loadAdditionalProperty() {
        this.loadingContent = true;
        const idTypeNode = this.idHierarchyNodeTypePropertyType === 'new' ? this.idTypeNode : null;
        this.hierarchyPropertyService.getHierarchyNodeTypePropertyType(this.idHierarchyNodeTypePropertyType, idTypeNode)
            .pipe(
                finalize(() => {
                    this.loadingContent = false;
                })
            )
            .subscribe(
                (data: IHierarchyNodeTypePropertyType) => {
                    this.nodeTypePropertyType = data;
                    this.initProperties(data);
                },
                (error: any) => {
                    this.errors = [error];
                    this.errorLoadEntity = error;
                }
            );
    }

    private convertToComboboxItem() {

    }

    private initProperties(nodeTypePropertyType: IHierarchyNodeTypePropertyType) {
        const properties = [
            {
                Code: 'IdCategory',
                Name: AppLocalization.Category,
                Type: 'Option',
                Value: nodeTypePropertyType.Category,
                IsRequired: true
            },
            {
                Code: 'Code',
                Name: AppLocalization.Code,
                Type: 'String',
                Value: nodeTypePropertyType.Code,
                IsRequired: true
            },
            {
                Code: 'Name',
                Name: AppLocalization.Name,
                Type: 'String',
                Value: nodeTypePropertyType.Name,
                IsRequired: true
            },
            {
                Code: 'IdValueType',
                Name: AppLocalization.DataType,
                Type: 'Option',
                Value: nodeTypePropertyType.ValueType,
                IsRequired: true
            }
        ];

        this.properties = properties;
    }


    optionControlDropDown(event: any) { 
        const control = event.control.comboBox;
        const property = event.property;
        if (property.Code === 'IdCategory') {
            this.hierarchyTypeEditorService
                .getPropertiesСategories(this.idTypeNode)
                .subscribe(
                    (data: IHierarchyNodeTypePropertyCategory[]) => {
                        property.arrayValues = data;
                    },
                    (error: any) => {
                        this.errors = [error];
                    }
                );
        } else if (property.Code === 'IdValueType') {
            this.hierarchyTypeEditorService
                .getValueTypes()
                .subscribe(
                    (data: IValueType[]) => {
                        property.arrayValues = data;
                    },
                    (error: any) => {
                        this.errors = [error];
                    }
                );
        }
    }

    save(properties: IEntityViewProperty[], propControl: any) {
        this.loadingContent = true;
        const nodeTypePropertyType = new HierarchyNodeTypePropertyType();
        if (!this.isNew) {
            nodeTypePropertyType.Id = this.idHierarchyNodeTypePropertyType as number;
        }
        nodeTypePropertyType.IdNodeType = this.idTypeNode;
        properties.forEach((prop: IEntityViewProperty) => {
            if (prop.Type === 'Option') {
                if (prop.Value) {
                    nodeTypePropertyType[prop.Code] = prop.Value.Id;
                }
            } else {
                nodeTypePropertyType[prop.Code] = prop.Value;
            }
        });
        this.hierarchyPropertyService
            .postNodeTypeAdditionallyProperty(nodeTypePropertyType)
            .then((idHierarchyNodeTypePropertyType: number) => {
                this.loadingContent = false;

                if (this.isNew) {
                    this.router.navigate(['../../../additionally-property-card/' + idHierarchyNodeTypePropertyType], {
                        preserveQueryParams: true,
                        relativeTo: this.activatedRoute
                    });
                } else {
                    this.loadAdditionalProperty();
                }

                propControl.cancelChangeProperty();
            })
            .catch((error: any) => {
                this.loadingContent = false;
                this.errors = [error];
            });
    }
}
