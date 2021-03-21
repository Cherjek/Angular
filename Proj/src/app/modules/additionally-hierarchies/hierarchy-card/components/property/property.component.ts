import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map, tap, finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { HierarchyPropertyService, Hierarchy } from '../../../../../services/additionally-hierarchies';
import { IEntityViewProperty } from '../../../../../services/common/Interfaces/IEntityViewProperty';

@Component({
    selector: 'property',
    templateUrl: './property.component.html',
    styleUrls: ['./property.component.less']
})
export class PropertyComponent implements OnInit, OnDestroy {

    public loadingContent: boolean;
    public errors: any[] = [];
    public errorLoadEntity: any;

    private hierarchy: Hierarchy;
    private idHierarchy: number | string;
    private subscription: Subscription;

    public get isNew() {
        return this.idHierarchy === 'new';
    }
    public properties: IEntityViewProperty[];

    constructor(private hierarchyPropertyService: HierarchyPropertyService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
        this.subscription = this.activatedRoute.parent.params.subscribe(params => {
            this.idHierarchy = params['id'];

            this.loadHierarchy();
        });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private loadHierarchy() {
        this.loadingContent = true;
        this.hierarchyPropertyService.getHierarchy(this.idHierarchy)
            .pipe(
                finalize(() => {
                    this.loadingContent = false;
                })
            )
            .subscribe(
                (data: Hierarchy) => {
                    this.hierarchy = data;
                    this.initProperties(data);
                },
                (error: any) => {
                    this.errorLoadEntity = error;
                }
            );
    }

    private initProperties(hierarchy: Hierarchy) {
        if (this.isNew) {
            hierarchy.IsPersonal = true;
        }
        this.properties = [
            { 
                Code: 'Name',
                Name: AppLocalization.TheNameOfTheHierarchy,
                Type: 'String',
                Value: hierarchy.Name,
                IsRequired: true
            },            
            { 
                Code: 'NodesName',
                Name: AppLocalization.NodeName,
                Type: 'String',
                Value: hierarchy.NodesName,
                IsRequired: true
            },
            { 
                Code: 'IsPersonal',
                Name: AppLocalization.Personal,
                Type: 'Bool',
                Value: hierarchy.IsPersonal
            },
            { 
                Code: 'AllowDuplicateLogicDevice',
                Name: AppLocalization.AllowDuplicateEquipment,
                Type: 'Bool',
                Value: hierarchy.AllowDuplicateLogicDevice
            },
            { 
                Code: 'Description',
                Name: AppLocalization.Description,
                Type: 'MultiString',
                Value: hierarchy.Description
            }
        ];
    }

    public save(properties: IEntityViewProperty[], propControl: any) {
        this.loadingContent = true;
        const hierarchy = new Hierarchy();
        if (!this.isNew) {
            hierarchy.Id = this.idHierarchy as number;
        }
        properties.forEach((prop: IEntityViewProperty) => {
            hierarchy[prop.Code] = prop.Value;
        });
        this.hierarchyPropertyService.postHierarchy(hierarchy)
            .then((idHierarchy: number) => {
                this.loadingContent = false;
                this.hierarchyPropertyService.hierarchyCache = null;
                if (this.isNew) {
                    this.router.navigate(['../../../hierarchy-card/' + idHierarchy], {
                        relativeTo: this.activatedRoute
                    });
                } else {
                    this.loadHierarchy();
                }

                propControl.cancelChangeProperty();
            })
            .catch((error: any) => {
                this.loadingContent = false;
                this.errors = [error];
            });
    }
}
