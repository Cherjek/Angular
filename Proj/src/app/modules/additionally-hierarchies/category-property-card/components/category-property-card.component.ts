import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NavigateItem } from '../../../../common/models/Navigate/NavigateItem';
import { ContextButtonItem, ContextButtonItemConfirm } from '../../../../controls/ContextButton/ContextButtonItem';
import { HierarchyPropertyService } from '../../../../services/additionally-hierarchies';
import { GlobalValues, PermissionCheck, AccessDirectiveConfig } from '../../../../core';

@Component({
    selector: 'ahm-category-property-card',
    templateUrl: './category-property-card.component.html',
    styleUrls: ['./category-property-card.component.less']
})
export class CategoryPropertyCardComponent implements OnInit, OnDestroy {

    public loadingPanel: boolean;
    public headerErrors: any[] = [];
    private subscription: Subscription;
    private idHierarchyNodeTypePropertyCategory: number | string;
    public get isNew() {
        return this.idHierarchyNodeTypePropertyCategory === 'new';
    }
    public contextButtonItems: ContextButtonItem[];
    public menuItems: NavigateItem[] = [
        {
            code: 'property',
            url: 'property',
            name: AppLocalization.Properties,
            access: 'HH_TYPE_CATEGORY_VIEW'
        }
    ];

    constructor(private hierarchyPropertyService: HierarchyPropertyService,
                private activatedRoute: ActivatedRoute,
                private permissionCheck: PermissionCheck) {
        this.subscription = this.activatedRoute.parent.params.subscribe(params => {
            this.idHierarchyNodeTypePropertyCategory = params['id'];
        });
    }

    ngOnInit() {
        this.accessContextMenuInit();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private accessContextMenuInit() {

        const checkAccess = [
            'HH_TYPE_CATEGORY_DELETE'
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
            promise = this.hierarchyPropertyService
                .deleteHierarchyNodeTypePropertyCategoryAsync(this.idHierarchyNodeTypePropertyCategory as number);
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
