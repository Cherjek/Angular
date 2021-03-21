import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin, of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IEntityViewProperty } from 'src/app/services/common/Interfaces/IEntityViewProperty';
import { DevicesCommandsService } from 'src/app/services/configuration/devices-commands.service';
import { IDeviceCommand } from 'src/app/services/configuration/Models/DeviceCommand';
import { DeviceTypeCommandsService } from 'src/app/services/configuration/device-type-commands.service';
import { DeviceTypeCommand } from 'src/app/services/configuration/Models/DeviceTypeCommand';
import { NoNamePipe } from 'src/app/shared/rom-pipes/no-name.pipe';

@Component({
    selector: 'rom-property',
    templateUrl: './property.component.html',
    styleUrls: ['./property.component.less'],
    providers: [DevicesCommandsService, DeviceTypeCommandsService]
})
export class PropertyComponent implements OnInit, OnDestroy {

    public loadingContent: boolean;
    public errors: any[] = [];
    public properties: any[] = [];
    errorLoadEntity: any;
    subscription: Subscription;
    command: IDeviceCommand;
    commandId: string | number;
    idLogicDevice: number;
    idLogicDeviceCommand: number;
    idDeviceType: number;
    devices: any[];
    private pipeNoName = new NoNamePipe();

    @ViewChild('propertyControl', { static: false }) propertyControl: any;

    public get isNew() {
        return this.commandId === 'new';
    }

    constructor(
        private deviceTypeCommandsService: DeviceTypeCommandsService,
        private devicesCommandsService: DevicesCommandsService,
        private router: Router,
        private activatedRoute: ActivatedRoute) { 
        this.subscription = this.activatedRoute.parent.params.subscribe(params => {
            this.commandId = params.id;
            this.idLogicDevice = params.idLogicDevice;
            this.idLogicDeviceCommand = params.idLogicDeviceCommand;

            devicesCommandsService.idLogicDeviceCommand = params.idLogicDeviceCommand;

            this.loadProperty();
        });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private loadProperty() {
        this.loadingContent = true;
        forkJoin(
            this.devicesCommandsService.getDeviceCommand(this.commandId),
            this.devices ? of(this.devices) : this.devicesCommandsService.getDevices(this.idLogicDevice)
        )
            .pipe(
                finalize(() => {
                    this.loadingContent = false;
                })
            )
            .subscribe(
                (data: any[]) => {
                    this.command = data[0] as IDeviceCommand;
                    this.initProperties(data[0]);

                    this.devices = data[1];
                    if (!this.isNew && this.command && this.command.Device) {
                        const device = this.devices.find(x => x.Id === this.command.Device.Id);
                        if (device) {
                            this.idDeviceType = device.IdDeviceType;
                        }
                    }
                },
                (error: any) => {
                    this.errors = [error];
                    this.errorLoadEntity = error;
                }
            );
    }

    private initProperties(command: IDeviceCommand) {
        const properties = [
            {
                Code: 'Device',
                Name: AppLocalization.Device,
                Type: 'Option',
                Value: command.Device,
                IsRequired: true
            },
            {
                Code: 'DeviceTypeCommand',
                Name: AppLocalization.DeviceTeam,
                Type: 'Option',
                Value: this.convertDeviceCommandType(command.DeviceTypeCommand),
                IsRequired: true
            }
        ];

        this.properties = properties;
    }

    private convertDeviceCommandType(deviceCommandType: DeviceTypeCommand) {
        if (deviceCommandType == null) {
            return deviceCommandType;
        }

        let name = '';
        if (deviceCommandType.DeviceCommandType) {
            name = deviceCommandType.DeviceCommandType.Name;
        }
        if (deviceCommandType.DeviceChannelType) {
            name = `${name} (${deviceCommandType.DeviceChannelType.Name})`;
        }
        deviceCommandType['Name'] = this.pipeNoName.transform(name.trim());
        return deviceCommandType;
    }

    optionControlDropDown(event: any) { 
        const property = event.property;
        if (event.control.event === 'LOAD_TRIGGER') {
            const control = event.control.comboBox;
            if (property.Code === 'Device') {
                property.arrayValues = this.devices.map(d => {
                    d.Name = this.pipeNoName.transform((d.Name || '').trim());
                    return d;
                });
            } else if (property.Code === 'DeviceTypeCommand') {
                if (!this.idDeviceType) {
                    property.arrayValues = [];
                    return;
                }
                this.deviceTypeCommandsService.idDeviceType = this.idDeviceType;
                this.deviceTypeCommandsService
                    .getCommands()
                    .subscribe(
                        (deviceTypeCommands) => {
                            property.arrayValues = deviceTypeCommands.map(dc => {
                                return this.convertDeviceCommandType(dc);
                            });
                        },
                        (error: any) => {
                            this.errors = [error];
                        }
                    );
            }
        } else {
            if (property.Code === 'Device') {
                if (property.Value) {
                    this.idDeviceType = property.Value.IdDeviceType;
                }
                const prop = this.propertyControl._properties.find((x: IEntityViewProperty) => x.Code === 'DeviceTypeCommand');
                if (prop) {
                    prop.Value = null;
                    prop.arrayValues = null;
                }
            }
        }
    }

    save(properties: IEntityViewProperty[], propControl: any) {
        this.errors = [];
        this.loadingContent = true;
        const command = {} as IDeviceCommand;
        if (!this.isNew) {
            command.Id = this.commandId as number;
        }
        command.IdLogicDeviceCommand = this.idLogicDeviceCommand;
        properties.forEach((prop: IEntityViewProperty) => {
            if (prop.Type === 'Option') {
                if (prop.Value) {
                    if (prop.Code === 'DeviceTypeCommand') {
                        (command[prop.Code] as any) = { Id: prop.Value.Id, IdDeviceType: this.idDeviceType };
                    } else {
                        command[prop.Code] = { Id: prop.Value.Id };
                    }
                }
            } else {
                command[prop.Code] = prop.Value;
            }
        });
        if (!command.DeviceTypeCommand) {
            this.errors.push(AppLocalization.TheDeviceCommandHasNotBeenSelected);
        }
        if (!command.Device) {
            this.errors.push(AppLocalization.NoDeviceSelected);
        }
        if (this.errors.length) {
            this.loadingContent = false;
            return;
        }
        this.devicesCommandsService
            .saveCommand(command)
            .then((commandId: number) => {
                this.loadingContent = false;

                if (this.isNew) {
                    this.router.navigate([`commands-module/logic-device/${this.idLogicDevice}/logic-device-command/${this.idLogicDeviceCommand}/device-command/${commandId}`], {
                        // queryParamsHandling: 'preserve',
                        // relativeTo: this.activatedRoute
                    });
                } else {
                    this.loadProperty();
                }

                propControl.cancelChangeProperty();
            })
            .catch((error: any) => {
                this.loadingContent = false;
                this.errors = [error];
            });
    }
}
