import { AppLocalization } from 'src/app/common/LocaleRes';
import {
    Component,
    OnInit,
    TemplateRef,
    ViewChild,
    OnDestroy
} from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Subscription, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataGrid, SelectionRowMode } from 'src/app/controls/DataGrid';
import {
    ActionButtonConfirmSettings as DGActionButtonConfirmSettings,
    ActionButtons as DGActionButton
} from '../../../../../controls/DataGrid/DataGridBase';
import { HierarchiesEditorService, HierarchyNodeLogicDevice } from 'src/app/services/additionally-hierarchies';
import { PermissionCheck } from '../../../../../core';

@Component({
    selector: 'ahm-logic-device-list',
    templateUrl: './logic-devices.component.html',
    styleUrls: ['./logic-devices.component.less']
})
export class LogicDeviceComponent implements OnInit, OnDestroy {

    public loadingContent: boolean;
    public errors: any[] = [];
    private logicDevices: HierarchyNodeLogicDevice[] = [];
    private _destructor = new Subject();
    private subscription: Subscription;
    private idNode: number;


    @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
    @ViewChild('logicDeviceCellTemplate', { static: true }) private logicDeviceCellTemplate: TemplateRef<any>;

    constructor(
        private activatedRoute: ActivatedRoute,
        private hierarchiesEditorService: HierarchiesEditorService,
        private router: Router,
        private permissionCheck: PermissionCheck
    ) {
        this.subscription = this.activatedRoute.parent.params.subscribe(params => {
            this.idNode = params.id;
        });
    }

    ngOnInit() {
        this.loadData();
    }

    ngOnDestroy(): void {
        this._destructor.next();
        this._destructor.complete();
        this.subscription.unsubscribe();
    }

    private loadData() {
        this.loadingContent = true;
        this.hierarchiesEditorService
            .getLogicDevices(this.idNode)
            .pipe(takeUntil(this._destructor))
            .subscribe(
                (logicDevices: HierarchyNodeLogicDevice[]) => {
                    this.logicDevices = logicDevices;
                    this.initDG();
                    this.loadingContent = false;
                },
                error => {
                    this.errors = [error];
                    this.loadingContent = false;
                }
            );
    }
    private initDG() {
        this.dataGrid.initDataGrid();
        this.dataGrid.KeyField = 'Id';
        this.dataGrid.SelectionRowMode = SelectionRowMode.Multiple;

        const checkAccess = [
            'HH_NODE_EQUIP_EDIT'
        ];

        this.permissionCheck.checkAuthorization(checkAccess)
        const obsrvs: any[] = [];
        checkAccess.forEach((access: string | string[]) => {
            obsrvs.push(this.permissionCheck.checkAuthorization(access));
        });

        forkJoin<boolean>(obsrvs)
            .subscribe(authorizeds => {
                if (authorizeds[0]) {
                    this.dataGrid.ActionButtons = [
                        new DGActionButton(
                            'ItemUp',
                            AppLocalization.MoveUp + ' &uarr;'
                        ),
                        new DGActionButton(
                            'ItemDown',
                            AppLocalization.MoveDown + ' &darr;'
                        ),
                        new DGActionButton(
                            'Delete',
                            AppLocalization.Delete,
                            new DGActionButtonConfirmSettings(
                                AppLocalization.DeleteRecordAlert,
                                AppLocalization.Delete
                            )
                        )
                    ];
                }
            });

        this.dataGrid.Columns = [
            {
                Name: 'DisplayName',
                AggregateFieldName: ['UnitAdditionalInfo', 'UnitDisplayName'],
                Caption: AppLocalization.Name,
                CellTemplate: this.logicDeviceCellTemplate,
                AppendFilter: false,
                disableTextWrap: true
            }
        ];

        this.dataGrid.DataSource = this.logicDevices;

    }

    public changeLogicDevices() {
        this.router.navigate(['/hierarchies-module/node-logic-devices-edit', this.idNode]/*, { queryParams: { idHierarchy: this.idHierarchy } }*/);
    }

    public deleteDGRows() {
        const ids = this.dataGrid.getSelectDataRows().map(item => item[this.dataGrid.KeyField]);
        this.removeLogicDevicesFromNode(ids);
    }

    private removeLogicDevicesFromNode(ids: number[]) {
        this.loadingContent = true;
        this.hierarchiesEditorService
            .removeLogicDevicesFromNode(ids, this.idNode)
            .then((res: any) => {
                this.loadData(); // ререндерим заново строки с бэкенда
            })
            .catch((error: any) => {
                this.loadingContent = false;
                this.errors = [error];
            });
    }

    public onDGRowActionBttnClick(event: any) {
        const ldView = event.item as HierarchyNodeLogicDevice;
        switch (event.action) {
            case 'Edit':
                break;
            case 'Properties':
                break;
            case 'Delete':
                this.removeLogicDevicesFromNode([ldView.Id]);
                break;
            case 'ItemUp':
                this.moveItem(ldView, -1);
                break;
            case 'ItemDown':
                this.moveItem(ldView, 1);
                break;
        }
    }

    private moveItem(ldView: HierarchyNodeLogicDevice, index: number) {
        const ids = this.logicDevices.map(x => x.Id);
        const x = ids.findIndex(x => x === ldView.Id);
        const y = x + index;
        if (y >= 0 && y < ids.length) {
            [ ids[x], ids[y] ] = [ ids[y], ids[x] ];

            this.updateSort(ids);
        }
    }
    private updateSort(ids: number[]) {
        this.loadingContent = true;
        this.hierarchiesEditorService
            .arrangeLogicDevicesAsync(ids, this.idNode)
            .then((res: any) => {
                this.loadData(); // ререндерим заново строки с бэкенда
            })
            .catch((error: any) => {
                this.loadingContent = false;
                this.errors = [error];
            });
    }
}
