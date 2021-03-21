import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigateItem } from '../../../../common/models/Navigate/NavigateItem';
import { Subscription, forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ContextButtonItem, ContextButtonItemConfirm } from '../../../../controls/ContextButton/ContextButtonItem';
import { HierarchiesEditorService, HierarchyNodeEdit } from '../../../../services/additionally-hierarchies';
import { GlobalValues, PermissionCheck, AccessDirectiveConfig } from '../../../../core';

@Component({
    selector: 'ahm-node-card',
    templateUrl: './node-card.component.html',
    styleUrls: ['./node-card.component.less']
})
export class NodeCardComponent implements OnInit, OnDestroy {

    public loadingPanel: boolean;
    public headerErrors: any[] = [];
    private subscription: Subscription;
    private idNode: number | string;
    public get isNew() {
        return this.idNode === 'new';
    }
    public nodeName: string;
    public hierarchyId: number;

    public contextButtonItems: ContextButtonItem[];
    public menuItems: NavigateItem[];

    constructor(
        private activatedRoute: ActivatedRoute,
        private hierarchiesEditorService: HierarchiesEditorService,
        private permissionCheck: PermissionCheck) { 
        this.subscription = activatedRoute.parent.params.subscribe(params => {
            this.idNode = params['id'];
            if (!this.isNew) {
                this.getNode();
            }
        });
        this.hierarchyId = activatedRoute.snapshot.queryParams.idHierarchy;
    }

    ngOnInit() {
        this.accessContextMenuInit();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private getNode() {
        this.hierarchiesEditorService
            .getNode(this.idNode as number)
            .subscribe((node: HierarchyNodeEdit) => {
                const prop = node.Properties.find(p => p.Code === 'Name');
                if (prop != null) {
                    this.nodeName = prop.Value;
                }
            });
    }

    private accessContextMenuInit() {

        this.menuItems = [
          {
              code: 'property',
              url: 'property',
              name: AppLocalization.Properties,
              access: 'HH_NODE_VIEW'
          },
          {
              code: 'logicDevices',
              url: 'logic-devices',
              name: AppLocalization.Label32,
              access: 'HH_NODE_EQUIP_VIEW'
          },
          {
              code: 'current-data',
              url: 'current-data',
              name: AppLocalization.Readings,
              access: 'OC_VIEW_HIERARCHY_NODE_DATA'
          },
          {
              code: "files",
              url: "files",
              name: AppLocalization.Files,
              access: Object.assign(new AccessDirectiveConfig(), { keySource: this.hierarchyId, source: 'Hierarchies', value: 'HH_VIEW_HIERARCHY_NODE_ATTACHMENTS' })
          }
        ];

        const checkAccess = [
            'HH_NODE_DELETE'
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
            promise = this.hierarchiesEditorService.deleteNode(this.idNode as number);
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