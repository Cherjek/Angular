import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IEntityViewProperty } from 'src/app/services/common/Interfaces/IEntityViewProperty';
import { ILogicDeviceCommand, LogicDeviceCommand } from 'src/app/services/configuration/Models/LogicDeviceCommand';
import { LogicDeviceCommandsService } from 'src/app/services/configuration/logic-device-commands.service';
import { IData } from 'src/app/services/configuration/Models/Data';

import { sessionStorageKey } from '../../../logic-device-command-create/components/create.component';

@Component({
    selector: 'rom-property',
    templateUrl: './property.component.html',
    styleUrls: ['./property.component.less'],
    providers: [LogicDeviceCommandsService]
})
export class PropertyComponent implements OnInit, OnDestroy {

    public loadingContent: boolean;
    public errors: any[] = [];
    public properties: any[] = [];
    errorLoadEntity: any;
    subscription: Subscription;
    command: ILogicDeviceCommand;
    commandId: string | number;
    idLogicDevice: number;

    public get isNew() {
        return this.commandId === 'new';
    }

    private _commandType: IData;
    private get commandType() {
        if (this._commandType == null) {
            const storage = sessionStorage.getItem(sessionStorageKey);
            this._commandType = JSON.parse(storage) as IData;
        }
        return this._commandType;
    }

    constructor(
        public logicDeviceCommandsService: LogicDeviceCommandsService,
        private router: Router,
        private activatedRoute: ActivatedRoute) { 
        this.subscription = this.activatedRoute.parent.params.subscribe(params => {
            this.commandId = params.id;
            this.idLogicDevice = params.idLogicDevice;
            logicDeviceCommandsService.idLogicDevice = params.idLogicDevice;

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
        this.logicDeviceCommandsService
            .getLogicDeviceCommand(this.commandId)
            .pipe(
                finalize(() => {
                    this.loadingContent = false;
                })
            )
            .subscribe(
                (data: ILogicDeviceCommand) => {
                    if (this.isNew) {
                        data.CommandType = this.commandType;
                    }
                    this.command = data;
                    this.initProperties(data);
                },
                (error: any) => {
                    this.errors = [error];
                    this.errorLoadEntity = error;
                }
            );
    }

    private initProperties(command: ILogicDeviceCommand) {
        const properties = [
            {
                Code: 'CommandType',
                Name: AppLocalization.TeamType,
                Type: 'Option',
                ReadOnly: true,
                Value: command.CommandType
            },
            {
                Code: 'Description',
                Name: AppLocalization.Description,
                Type: 'MultiString',
                Value: command.Description
            }
        ];

        this.properties = properties;
    }

    save(properties: IEntityViewProperty[], propControl: any) {
        this.loadingContent = true;
        const command = new LogicDeviceCommand();
        if (!this.isNew) {
            command.Id = this.commandId as number;
        }
        command.IdLogicDevice = this.idLogicDevice;
        properties.forEach((prop: IEntityViewProperty) => {
            if (prop.Type === 'Option') {
                if (prop.Value) {
                    command[prop.Code] = { Id: prop.Value.Id };
                }
            } else {
                command[prop.Code] = prop.Value;
            }
        });
        this.logicDeviceCommandsService
            .saveLogicDeviceCommand(command)
            .then((commandId: number) => {
                this.loadingContent = false;

                if (this.isNew) {
                    this.router.navigate([`commands-module/logic-device/${this.idLogicDevice}/command/${commandId}/property`], {
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
