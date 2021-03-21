import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    TemplateRef,
    Input,
    EventEmitter,
    Output
} from '@angular/core';
import { map, tap, finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
    MatTreeFlatDataSource,
    MatTreeFlattener
} from '@angular/material/tree';

import { IMatTreeActionButton } from './models/MatTreeActionButton';
import { IMatTreeActionButtonEmit } from './models/MatTreeActionButtonEmit';
import { FlatNode } from './models/FlatNode';

@Component({
    selector: 'mat-tree-ro5',
    templateUrl: './mat-tree.component.html',
    styleUrls: ['./mat-tree.component.less']
})
export class MatTreeComponent implements OnInit, OnDestroy {

    @Input() childPropertyName = 'Nodes';
    @Input() nodeName = 'Name';
    @Input() nodeId = 'Id';
    @Input() data: any[];
    @Input() nodeTemplate: TemplateRef<any>;
    @Input() actionButtons: IMatTreeActionButton[];
    @Output() actionMenuClick = new EventEmitter<IMatTreeActionButtonEmit>();

    private loadingContent: boolean;
    private errors: any[] = [];

    private subscription: Subscription;

    private _transformer = (node: any, level: number) => {
        const _node = {
            expandable: !!node[this.childPropertyName] && node[this.childPropertyName].length > 0,
            name: node[this.nodeName],
            nodeId: node[this.nodeId],
            data: node,
            level: level
        };
        return _node;
    };
    
    treeControl = new FlatTreeControl<FlatNode>(
        node => node.level,
        node => node.expandable
    );

    treeFlattener = new MatTreeFlattener(
        this._transformer,
        node => node.level,
        node => node.expandable,
        node => node.Nodes
    );
    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    hasChild = (_: number, node: FlatNode) => node.expandable;    

    constructor() {
    }

    ngOnInit() {
        this.dataSource.data = this.data;
    }
    ngOnDestroy(): void {}    
}
