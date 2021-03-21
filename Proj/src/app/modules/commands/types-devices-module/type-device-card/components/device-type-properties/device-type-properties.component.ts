import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild } from '@angular/core';

import * as GridControls from '../../../../../../controls/DataGrid';
import DataGrid = GridControls.DataGrid;
import DGSelectionRowMode = GridControls.SelectionRowMode;
import DGActionButtom = GridControls.ActionButtons;
import DGActionButtonConfirmSettings = GridControls.ActionButtonConfirmSettings;

import { DevicePropertyTypeService } from 'src/app/services/configuration/device-property-type.service';
import { IDevicePropertyType } from 'src/app/services/configuration/Models/DevicePropertyType';
import { Observable, of, forkJoin } from 'rxjs';
import { PermissionCheck, DataGridCurrentItemService } from '../../../../../../core';
import { ActivatedRoute } from '@angular/router';
import { DevicePropertyTypesService } from 'src/app/services/references/device-property-types.service';

@Component({
    selector: 'rom-device-type-properties',
    templateUrl: './device-type-properties.component.html',
    styleUrls: ['./device-type-properties.component.less'],
    providers: [DevicePropertyTypesService]
})
export class DeviceTypePropertiesComponent implements OnInit {

    public errors: any[] = [];
    public loadingContentPanel: boolean;
    public DGSelectionRowMode = DGSelectionRowMode;

    deviceTypeId: number;
    referenceProperties: IDevicePropertyType[];

    @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
    
    constructor(
        private activatedRoute: ActivatedRoute,
        private permissionCheck: PermissionCheck,
        private devicePropertiesService: DevicePropertyTypesService,
        private devicePropertyTypeService: DevicePropertyTypeService) { 
            this.deviceTypeId = activatedRoute.parent.snapshot.params.id;
            devicePropertyTypeService.deviceTypeId = this.deviceTypeId;
        }

    ngOnInit() {
        this.loadData();
    }

    private loadData() {

        this.loadingContentPanel = true;
        forkJoin(this.devicePropertyTypeService
            .getDeviceTypePropertyTypes(),
            this.devicePropertiesService.get())
            .subscribe((results: any[]) => {
                this.loadingContentPanel = false;

                this.referenceProperties = results[1]
                    .filter((rp: IDevicePropertyType) => results[0].find((p: IDevicePropertyType) => rp.Id === p.Id) == null);
                this.initDG(results[0]);
            },
            (error: any) => {
                this.loadingContentPanel = false;
                this.errors.push(error);
            });
    }

    private initDG(properties: IDevicePropertyType[]) {
        
        this.accessDataGridInit().subscribe((results: boolean[]) => {

            this.dataGrid.initDataGrid();
            this.dataGrid.KeyField = 'Id';
            this.dataGrid.Columns = [{
                Caption: AppLocalization.Code,
                Name: 'Code'
            }, {
                Caption: AppLocalization.Name,
                Name: 'Name'
            }];

            if (results[0]) {
                this.dataGrid.ActionButtons = [
                    new DGActionButtom("Delete",
                        AppLocalization.Delete,
                        new DGActionButtonConfirmSettings(AppLocalization.DeleteConfirm, AppLocalization.Delete))
                ];
            }

            this.dataGrid.DataSource = properties;

        });
    }
    private accessDataGridInit(): Observable<boolean[]> {

        const checkAccess = [
            'ADM_DELETE_GROUP'
        ];

        const obsrvs: any[] = [];
        checkAccess.forEach((access: string | string[]) => {
            obsrvs.push(of(true)); // this.permissionCheck.checkAuthorization(access));
        });

        return forkJoin<boolean>(obsrvs);
    }

    public onDGRowActionBttnClick(button: any) {
        if (button.action === 'Delete') {
            this.deleteProperties([button.item]);
        }
    }

    deleteProperties(properties: IDevicePropertyType[]) {
        this.loadingContentPanel = true;
        this.devicePropertyTypeService
            .detachDeviceTypePropertyTypes(properties)
            .then((res: any) => {
                this.loadingContentPanel = false;
                this.loadData();
            })
            .catch((error: any) => {
                this.loadingContentPanel = false;
                this.errors = [error];
            });
    }

    addProperties(properties: IDevicePropertyType[]) {
        this.loadingContentPanel = true;
        this.devicePropertyTypeService
            .attachDeviceTypePropertyTypes(properties)
            .then((res: any) => {
                this.loadingContentPanel = false;
                this.loadData();
            })
            .catch((error: any) => {
                this.loadingContentPanel = false;
                this.errors = [error];
            });
    }
}
