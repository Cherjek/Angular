import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigateItem } from '../../../../common/models/Navigate/NavigateItem';
import { ActivatedRoute } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ContextButtonItem, ContextButtonItemConfirm } from '../../../../controls/ContextButton/ContextButtonItem';
import { HierarchyPropertyService, NodeType } from '../../../../services/additionally-hierarchies';
import { GlobalValues, PermissionCheck, AccessDirectiveConfig } from '../../../../core';

@Component({
    selector: 'type-node-card',
    templateUrl: './type-node-card.component.html',
    styleUrls: ['./type-node-card.component.less'],
})
export class TypeNodeCardComponent implements OnInit, OnDestroy {

    public loadingPanel: boolean;
    public headerErrors: any[] = [];
    public get isNew() {
        return this.idNodeType === 'new';
    }
    public nodeTypeName: string;

    public contextButtonItems: ContextButtonItem[];
    public menuItems: NavigateItem[] = [
        {
            code: 'property',
            url: 'property',
            name: AppLocalization.Properties,
            access: 'HH_TYPE_VIEW'
        },
        {
            code: 'categories',
            url: 'categories',
            name: AppLocalization.PropertyCategories,
            access: 'HH_TYPE_CATEGORIES_VIEW'
        },
        {
            code: 'add-properties',
            url: 'add-properties',
            name: AppLocalization.AdditionalProperties,
            access: 'HH_TYPE_PROPERTIES_VIEW'
        },
    ];
    private subscription: Subscription;
    private idNodeType: number | string;

    constructor(private hierarchyPropertyService: HierarchyPropertyService,
                private activatedRoute: ActivatedRoute,
                private permissionCheck: PermissionCheck) {
        this.subscription = this.activatedRoute.parent.params.subscribe(params => {
            this.idNodeType = params['id'];
            if (!this.isNew) {
                this.getNodeType();
            }
        });
    }

    ngOnInit() { 
        this.accessContextMenuInit();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private getNodeType() {
        this.hierarchyPropertyService
            .getHierarchyNodeType(this.idNodeType as number)
            .subscribe((node: NodeType) => {
                this.nodeTypeName = node.Name;
            });
    }

    private accessContextMenuInit() {

        const checkAccess = [
            'HH_TYPE_DELETE'
        ];

        let contextButtonItems: ContextButtonItem[] = [];

        const obsrvs: any[] = [];
        checkAccess.forEach((access: string | string[] | AccessDirectiveConfig) => {
            obsrvs.push(this.permissionCheck.checkAuthorization(access));
        });

        forkJoin(obsrvs)
            .pipe(
                finalize(() => {
                    this.contextButtonItems = contextButtonItems;
                })
            )
            .subscribe((response: any[]) => {
                if (response[0]) {
                    contextButtonItems = [
                        {
                            code: 'delete',
                            name: AppLocalization.Delete,
                            confirm: new ContextButtonItemConfirm(AppLocalization.DeleteConfirm, AppLocalization.Delete)
                        }
                    ];
                }
            });
    }

    public contextButtonHeaderClick(code: string) {
        this.loadingPanel = true;
        let promise: Promise<any> = null;
        let callback: Function;
        if (code === 'delete') {
            promise = this.hierarchyPropertyService.deleteHierarchyNodeTypeAsync(this.idNodeType as number);
            callback = (result: any) => {
                if (result === 0) {
                    GlobalValues.Instance.Page.backwardButton.navigate();
                }
            };
        }
        promise.then(
            (result: any) => {
                this.loadingPanel = false;
                callback(result);
            }).catch(
                (error: any) => {
                    this.loadingPanel = false;
                    this.headerErrors = [error];
                });
    }


}
