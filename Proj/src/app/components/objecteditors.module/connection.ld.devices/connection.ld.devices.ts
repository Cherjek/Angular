import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { ConnectionLDDevicesService } from "../../../services/objecteditors.module/connection.ld.devices/ConnectionLDDevices.service";
import { DataGrid } from "../../../controls/DataGrid";
import { DataColumnTextAlign } from "../../../controls/DataGrid";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/index";
import { DeviceView } from "../../../services/objecteditors.module/Models/DeviceView";

import { GlobalValues } from '../../../core';

@Component({
  selector: 'connection-ld-devices',
  templateUrl: './connection.ld.devices.html',
  styleUrls: ['./connection.ld.devices.css']
})
export class ConnectionLDDevicesComponent implements OnInit, OnDestroy {
    connectionLDDevices$: Subscription;

    constructor(public connectionLDDevices: ConnectionLDDevicesService,
              public activatedRoute: ActivatedRoute) {

        this.subscription = this.activatedRoute.queryParams.subscribe((params: any) => {
            this.unitId = params['unitId'];
            this.ldId = params['ldId'];
            this.connectDeviceId = params['deviceId'];
        });
    }


    @ViewChild('Ro5DataGrid', { static: true }) dataGrid: DataGrid;
    @ViewChild('colLogicDevices', { static: true }) colLogicDevices: TemplateRef<any>;
    @ViewChild('cellDevice', { static: true }) cellDevice: TemplateRef<any>;

    subscription: Subscription;
    unitId: number;
    ldId: number;
    connectDeviceId: number;
    loadingContentPanel: boolean = true;
    errors: any[] = [];
    devices: any[];
    devicesLength: any = 0;

    ngOnDestroy() {
        this.unsubscriber(this.connectionLDDevices$);
        this.unsubscriber(this.subscription);
    }

    unsubscriber(sub: Subscription) {
        if (sub) {
            sub.unsubscribe();
        }
    }

    ngOnInit() {
        
        // 3332 3987
        this.connectionLDDevices$ = this.connectionLDDevices.get(this.unitId).subscribe((data: any[]) => {

                if (this.ldId) {
                    data = data.filter((d: any) => {
                        let result: any[] = [];
                        if (d.LogicDevices) {
                            result = (<any[]>d.LogicDevices).filter((ld: any) => ld.Id == this.ldId);
                        }
                        return result.length === 0;
                    });
                }

                let remove = (id: number, items: any[]) => {
                    //remove
                    let item = items.find((td: any) => td.Id == id);
                    let index = items.indexOf(item);
                    items.splice(index, 1);
                }

                let recursiveRemove = (parentId: number, items: any[]) => {

                    remove(parentId, items);

                    let childItems = items
                        .filter((td: any) => td.IdParent == parentId);

                    childItems
                        .map((ci: any) => ci.Id)
                        .forEach((Id: number) => {

                            recursiveRemove(Id, items);
                    });
                }

                if (this.connectDeviceId) {
                    recursiveRemove(this.connectDeviceId, data);
                }

                /*
                TEST
                
                let parentId = 3;
                let _testData = [
                    {
                        Id: 1
                    },
                    {
                        Id: 2,
                        IdParent: 3
                    },
                    {
                        Id: 4,
                        IdParent: 3
                    },
                    {
                        Id: 3,
                        IdParent: 8
                    },
                    {
                        Id: 8
                    },
                    {
                        Id: 9
                    },
                    {
                        Id: 5,
                        IdParent: 3
                    },
                    {
                        Id: 10,
                        IdParent: 2
                    }
                ];

                recursiveRemove(parentId, _testData);*/

                data.forEach((item: any) => {
                    if (!item['DisplayName'] || !item['DisplayName'].length) {
                        item['DisplayName'] = '';
                    }
                    if (!item['LogicDevices'] || !item['LogicDevices'].length) {
                        item['LogicDevices'] = [{ DisplayName: AppLocalization.NoConnection }];
                    }
                });

                this.devicesLength = (data || []).length;
                if (this.devicesLength > 0) {
                    this.initDataGrid();
                    this.dataGrid.DataSource = data;
                }
                this.loadingContentPanel = false;
            },

            (error: any) => {
                this.errors.push(error);
                this.loadingContentPanel = false;
            });
    }

    private initDataGrid() {
        this.dataGrid.initDataGrid();
        this.dataGrid.KeyField = 'id';
        this.dataGrid.Columns = [
            {
                Name: "DisplayName",
                Caption: AppLocalization.Device,
                CellTemplate: this.cellDevice
            },
            {
                Name: "LogicDevices",
                Caption: AppLocalization.EquipmentConnection,
                AggregateFieldName: ["DisplayName"],
                CellTemplate: this.colLogicDevices
            }
        ];
    }

    connectDevice(device: any) {
        GlobalValues.Instance.Page = {
            connectionLDDevicesComponent: {
                deviceId: device.Id,
                name: device.DisplayName
            }
        };
        GlobalValues.Instance.Page.backwardButton.navigate();
    }
}
