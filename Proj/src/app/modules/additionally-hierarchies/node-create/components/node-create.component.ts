import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
    HierarchyTypeEditorService,
    NodeType
} from 'src/app/services/additionally-hierarchies';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export const sessionStorageKey = 'NodeCreateComponent.sessionStorageKey';

@Component({
    selector: "ahm-node-create",
    templateUrl: './node-create.component.html',
    styleUrls: ['./node-create.component.less']
})
export class NodeCreateComponent implements OnInit, OnDestroy {
    private idHierarchy: number;
    typesSource: any[];
    loadingContent = true;
    errors: any[] = [];
    private _destructor = new Subject();

    constructor(
        private hierarchyTypeEditorService: HierarchyTypeEditorService,
        public router: Router,
        public activatedRoute: ActivatedRoute
    ) {
        this.activatedRoute.queryParams
            .pipe(takeUntil(this._destructor))
            .subscribe((params: any) => {
                this.idHierarchy = params['idHierarchy'];
            });
    }

    ngOnInit() {
        this.hierarchyTypeEditorService
            .getNodeTypes(this.idHierarchy)
            .pipe(takeUntil(this._destructor))
            .subscribe(
                (types: NodeType[]) => {
                    this.typesSource = types;
                    this.loadingContent = false;
                },
                (error: any) => {
                    this.loadingContent = false;
                    this.errors = [error];
                }
            );
    }

    ngOnDestroy(): void {
        this._destructor.next();
        this._destructor.complete();
    }

    onItemClick(event: any) {
        const selectedType =  event.Data as NodeType;

        sessionStorage.setItem(sessionStorageKey, JSON.stringify(selectedType));
        this.router.navigate(['../node-card/new'], {
            preserveQueryParams: true,
            relativeTo: this.activatedRoute
        });
    }
}
