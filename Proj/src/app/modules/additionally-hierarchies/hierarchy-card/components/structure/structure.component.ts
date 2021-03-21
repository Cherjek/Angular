import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map, tap, finalize } from 'rxjs/operators';
import { Subscription, forkJoin } from 'rxjs';

import { HierarchyCardService, Node, HierarchiesEditorService } from '../../../../../services/additionally-hierarchies';

import { MatTreeActionButton, 
         MatTreeActionButtonConfirmSettings, 
         MatTreeActionButtonsComponent,
         FlatNode,
         IMatTreeActionButtonEmit } from '../../../../../shared/material-angular/mat-tree';
import { PermissionCheck } from '../../../../../core';

@Component({
    selector: 'ahm-structure',
    templateUrl: './structure.component.html',
    styleUrls: ['./structure.component.less']
})
export class StructureComponent implements OnInit, OnDestroy {
    
    public loadingContent: boolean;
    public errors: any[] = [];
    
    public treeNodes: Node[];
    private idHierarchy: number;
    private subscription: Subscription;
    public matTreeActionButtons: MatTreeActionButton[];

    constructor(private hierarchiesEditorService: HierarchiesEditorService,
                private hierarchyCardService: HierarchyCardService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private permissionCheck: PermissionCheck) {
        this.subscription = this.activatedRoute.parent.params.subscribe(params => {
            this.idHierarchy = params['id'];

            this.loadData();
        });
    }

    ngOnInit() {
        this.matTreeActionButtons = [
        ];

        const checkAccess = [
            'HH_NODE_CREATE',
            'HH_NODE_DELETE',
            'HH_NODE_EDIT'
        ];

        this.permissionCheck.checkAuthorization(checkAccess)
        const obsrvs: any[] = [];
        checkAccess.forEach((access: string | string[]) => {
            obsrvs.push(this.permissionCheck.checkAuthorization(access));
        });

        forkJoin<boolean>(obsrvs)
            .subscribe(authorizeds => {
                if (authorizeds[2]) {
                    this.matTreeActionButtons.push(
                        new MatTreeActionButton('nodeUp', AppLocalization.MoveUp + ' &uarr;')
                    );
                    this.matTreeActionButtons.push(
                        new MatTreeActionButton('nodeDown', AppLocalization.MoveDown + ' &darr;')
                    );
                }
                if (authorizeds[0]) {
                    this.matTreeActionButtons.push(
                        new MatTreeActionButton('createNodeChild', AppLocalization.CreateAChild)
                    );
                }
                if (authorizeds[1]) {
                    this.matTreeActionButtons.push(
                        new MatTreeActionButton('delete', AppLocalization.Delete, new MatTreeActionButtonConfirmSettings(AppLocalization.DeleteNodeAlert, AppLocalization.RemoveTheNode))
                    );
                }
            });
    
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public addNode(parent?: Node) {
        this.router.navigate(['/hierarchies-module/node-create'],
            {
                queryParams: {
                    idHierarchy: this.idHierarchy,
                    nodeParent: parent ? parent.Id : null
                }
            });
    }

    public onNavigate(node: FlatNode) {
        this.router.navigate(['/hierarchies-module/node-card', node.data.Id],
        { 
            queryParams: { 
                idHierarchy: node.data.IdHierarchy
            } 
        });
    }

    private loadData() {
        this.treeNodes = null;
        this.loadingContent = true;
        this.hierarchyCardService.getNodeTree(this.idHierarchy)
            .pipe(
                finalize(() => {
                    this.loadingContent = false;
                })
            )
            .subscribe(
                (tree: Node[]) => {
                    this.treeNodes = tree;
                },
                (error: any) => {
                    this.errors = [error];
                }
            );
    }

    public actionMenuTreeClick(emit: IMatTreeActionButtonEmit) {
        const node = emit.node.data as Node;
        if (emit.event === 'createNodeChild') {
            this.addNode(node);
        } else if (emit.event === 'delete') {
            this.deleteNodeAsync(node.Id);
        } else if (emit.event === 'nodeUp') {
            this.arrangeNodesAsync(node, -1);
        } else if (emit.event === 'nodeDown') {
            this.arrangeNodesAsync(node, 1);
        }
    }

    private getNode(tree: Node, target: number | string): Node {
        if (tree.Id == target) {
            return tree;
        } 
        for (const child of tree.Nodes) {
            const res = this.getNode(child, target);          
            if (res) {
                return res;
            }
        }
    }
    private arrangeNodesAsync(node: Node, index: number) {
        const nodeParent = this.getNode(Object.assign(new Node(), { Nodes: this.treeNodes }), node.IdParentHierarchyNode);
        if (nodeParent && nodeParent.Nodes && nodeParent.Nodes.length) {
            const ids = nodeParent.Nodes.map(x => x.Id);

            const x = ids.findIndex(x => x === node.Id);
            const y = x + index;
            if (y >= 0 && y < ids.length) {
                [ ids[x], ids[y] ] = [ ids[y], ids[x] ];

                this.updateSort(ids, nodeParent.Id || -1);
            }
        }
    }
    private updateSort(ids: number[], idParent: number) {
        this.loadingContent = true;
        this.hierarchiesEditorService
            .arrangeNodesAsync(this.idHierarchy, ids, idParent)
            .then((res: any) => {
                this.loadData(); // ререндерим заново строки с бэкенда
            })
            .catch((error: any) => {
                this.loadingContent = false;
                this.errors = [error];
            });
    }
    private deleteNodeAsync(id: number) {
        this.loadingContent = true;
        this.hierarchiesEditorService
            .deleteNode(id)
            .then((res: any) => {
                this.loadData(); // ререндерим заново строки с бэкенда
            })
            .catch((error: any) => {
                this.loadingContent = false;
                this.errors = [error];
            });
    }
}
