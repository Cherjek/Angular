import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigateItem } from '../../../../common/models/Navigate/NavigateItem';
import { ActivatedRoute } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ContextButtonItem, ContextButtonItemConfirm } from '../../../../controls/ContextButton/ContextButtonItem';
import { HierarchyPropertyService, IHierarchy } from '../../../../services/additionally-hierarchies';
import { GlobalValues, PermissionCheck, AccessDirectiveConfig } from '../../../../core';

@Component({
    selector: 'hierarchy-card',
    templateUrl: './hierarchy-card.component.html',
    styleUrls: ['./hierarchy-card.component.less']
})
export class HierarchyCardComponent implements OnInit, OnDestroy {
    
    public loadingPanel: boolean;
    public headerErrors: any[] = [];
    public get isNew() {
        return this.idHierarchy === 'new';
    }
    public hierarchy: IHierarchy;
    
    public contextButtonItems: ContextButtonItem[];
    public menuItems: NavigateItem[] = [

        {
            code: 'property',
            url: 'property',
            name: AppLocalization.Properties,
            access: 'HH_VIEW'
        },
        {
            code: 'structure',
            url: 'structure',
            name: AppLocalization.Composition,
            access: 'HH_NODES_VIEW'
        },
        {
            code: 'type-nodes',
            url: 'type-nodes',
            name: AppLocalization.NodeTypes,
            access: 'HH_TYPES_VIEW'
        }
    ];

    private subscription: Subscription;
    private idHierarchy: number | string;

    constructor(private hierarchyPropertyService: HierarchyPropertyService,
                private activatedRoute: ActivatedRoute,
                private permissionCheck: PermissionCheck) { 
        this.subscription = this.activatedRoute.parent.params.subscribe(params => {
            this.idHierarchy = params['id'];
            if (!this.isNew) {
                this.getHierarchy();
            }
        });
    }

    ngOnInit() { 
        this.accessContextMenuInit();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.hierarchyPropertyService.hierarchyCache = null;
    }

    private getHierarchy() {
        this.hierarchyPropertyService
            .getHierarchy(this.idHierarchy)
            .subscribe((hierarchy: IHierarchy) => this.hierarchy = hierarchy);
    }

    private accessContextMenuInit() {

        const checkAccess = [
            'HH_DELETE'
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
            promise = this.hierarchyPropertyService.deleteHierarchyAsync(this.idHierarchy as number);
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
