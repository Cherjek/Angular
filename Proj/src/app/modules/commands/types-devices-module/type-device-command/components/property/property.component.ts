import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceTypeCommand } from 'src/app/services/configuration/Models/DeviceTypeCommand';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { DeviceTypeCommandsService } from 'src/app/services/configuration/device-type-commands.service';
import { finalize } from 'rxjs/operators';
import { ReferenceDeviceCommandTypesService } from 'src/app/services/commands/Reference/reference-device-command-types.service';
import { DataQueryMainService } from 'src/app/services/data-query';
import { IEntityViewProperty } from 'src/app/services/common/Interfaces/IEntityViewProperty';

@Component({
    selector: 'rom-property',
    templateUrl: './property.component.html',
    styleUrls: ['./property.component.less'],
    providers: [DeviceTypeCommandsService, ReferenceDeviceCommandTypesService]
})
export class PropertyComponent implements OnInit, OnDestroy {

    public loadingContent: boolean;
    public errors: any[] = [];
    public properties: any[] = [];
    errorLoadEntity: any;
    subscription: Subscription;
    command: DeviceTypeCommand;
    commandId: string | number;
    idDeviceType: number;
    deviceCommandTypes: any[];
    deviceChannelTypes: any[];
    sub$: Subscription;
    private commandTypesNames: any[];
    private channelTypesNames: any[];

    public get isNew() {
        return this.commandId === 'new';
    }

    constructor(
        public dataQueryMainService: DataQueryMainService,
        public deviceCommandTypesService: ReferenceDeviceCommandTypesService,
        public deviceTypeCommandsService: DeviceTypeCommandsService,
        private router: Router,
        private activatedRoute: ActivatedRoute) { 
        // this.commandId = this.activatedRoute.parent.snapshot.params.id;
        // this.idDeviceType = this.activatedRoute.parent.snapshot.params.idDeviceType;
        this.subscription = this.activatedRoute.parent.params.subscribe(params => {
            this.commandId = params.id;
            this.idDeviceType = params.idDeviceType;
            deviceTypeCommandsService.idDeviceType = params.idDeviceType;

            this.loadProperty();
        });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.unsubscriber([this.subscription, this.sub$]);
    }

    private loadProperty() {
        this.loadingContent = true;
        this.sub$ = forkJoin(
            this.deviceTypeCommandsService.getCommand(this.commandId),
            this.deviceCommandTypesService.get(),
            this.dataQueryMainService.getDeviceChannelTypes()
        )
            .pipe(
                finalize(() => {
                    this.loadingContent = false;
                })
            )
            .subscribe(
                (data: any[]) => {
                    this.command = data[0] as DeviceTypeCommand;
                    this.initProperties(data[0]);

                    this.deviceCommandTypes = data[1];
                    this.deviceChannelTypes = data[2];

                    this.initPropertyNames();
                },
                (error: any) => {
                    this.errors = [error];
                    this.errorLoadEntity = error;
                }
            );
    }

    private initProperties(command: DeviceTypeCommand) {
        const properties = [
            {
                Code: 'DeviceCommandType',
                Name: AppLocalization.TeamType,
                Type: 'Option',
                Value: command.DeviceCommandType,
                IsRequired: true
            },
            {
                Code: 'DeviceChannelType',
                Name: AppLocalization.ChannelType,
                Type: 'Option',
                Value: command.DeviceChannelType,
                IsRequired: true
            }
        ];

        this.properties = properties;
    }

    optionControlDropDown(event: any) { 
        const property = event.property;
        if (property.Code === 'DeviceCommandType') {
            property.arrayValues = this.deviceCommandTypes;
        } else if (property.Code === 'DeviceChannelType') {
            property.arrayValues = this.deviceChannelTypes;
        }
    }

    save(properties: IEntityViewProperty[], propControl: any) {
        if (!this.noErrors(properties)) { return; }
        this.loadingContent = true;
        const command = new DeviceTypeCommand();
        if (!this.isNew) {
            command.Id = this.commandId as number;
        }
        command.IdDeviceType = this.idDeviceType;
        properties.forEach((prop: IEntityViewProperty) => {
            if (prop.Type === 'Option') {
                if (prop.Value) {
                    command[prop.Code] = { Id: prop.Value.Id };
                }
            } else {
                command[prop.Code] = prop.Value;
            }
        });
        this.deviceTypeCommandsService
            .saveCommand(command)
            .then((commandId: number) => {
                this.loadingContent = false;

                if (this.isNew) {
                    const url = '/commands-module/c/types-devices/' + this.idDeviceType + '/command/' + commandId;
                    this.router.navigateByUrl(url);
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

    private unsubscriber(sub: Subscription[]) {
        sub.forEach(x => {
            if (x) { x.unsubscribe(); }
        });
    }

    private noErrors(props: IEntityViewProperty[]): boolean {
        for (let i = 0; i < props.length; i++) {
            const prop = props[i].Value;
            if (prop === null || !this.commandTypesNames.find(_ => prop.Name)) {
            if (i === 0) {
              this.errors = [`${AppLocalization.NeedSet} "${AppLocalization.TeamType}"`];
            } else if ( prop === null || !this.channelTypesNames.find(_ => prop.Name)) {
              this.errors = [`${AppLocalization.NeedSet} "${AppLocalization.ChannelType}"`];
            }
            return false;
          }

        }
        return true;
      }

    private initPropertyNames() {
        this.commandTypesNames = this.deviceCommandTypes.map(x => x.Name);
        this.channelTypesNames = this.deviceChannelTypes.map(x => x.Name);
    }
}
