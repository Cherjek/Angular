import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { DeviceTypeCommandParameterService } from 'src/app/services/configuration/device-type-command-parameter.service';
import { DevicesCommandsService } from 'src/app/services/configuration/devices-commands.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { IDeviceCommand } from 'src/app/services/configuration/Models/DeviceCommand';
import { IDeviceTypeCommandParameter } from 'src/app/services/configuration/Models/DeviceTypeCommandParameter';
import { DeviceCommandParametersService } from 'src/app/services/configuration/device-command-parameters.service';
import { IDeviceCommandParameter } from 'src/app/services/configuration/Models/DeviceCommandParameter';

export const sessionStorageKey = 'DeviceTypeParametersCreateComponent.sessionStorageKey';

@Component({
    selector: 'rom-device-type-parameters',
    templateUrl: './device-type-parameters.component.html',
    styleUrls: ['./device-type-parameters.component.less'],
    providers: [DevicesCommandsService, DeviceTypeCommandParameterService, DeviceCommandParametersService]
})
export class DeviceTypeParametersComponent implements OnInit, OnDestroy {

    idLogicDevice: number;
    idLogicDeviceCommand: number;
    idDeviceCommand: number;
    parameters: IDeviceTypeCommandParameter[];

    errors: any[] = [];
    loadingContent = true;
    private _destructor = new Subject();
    private _destructor2 = new Subject();

    constructor(
        private deviceCommandParametersService: DeviceCommandParametersService,
        private devicesCommandsService: DevicesCommandsService,
        private deviceTypeCommandParameterService: DeviceTypeCommandParameterService,
        private router: Router,
        private activatedRoute: ActivatedRoute) {
        this.idLogicDevice = this.activatedRoute.parent.snapshot.params.idLogicDevice;
        this.idLogicDeviceCommand = this.activatedRoute.parent.snapshot.params.idLogicDeviceCommand;
        this.idDeviceCommand = this.activatedRoute.parent.snapshot.params.idDeviceCommand;

        devicesCommandsService.idLogicDeviceCommand = this.idLogicDeviceCommand;
        deviceCommandParametersService.idDeviceCommand = this.idDeviceCommand;
    }

    ngOnInit() {
        this.devicesCommandsService.getDeviceCommand(this.idDeviceCommand)
            .pipe(
                takeUntil(this._destructor)
            )
            .subscribe(
                (deviceCommand: IDeviceCommand) => {

                    this.deviceTypeCommandParameterService.idDeviceType = deviceCommand.DeviceTypeCommand.IdDeviceType;
                    this.deviceTypeCommandParameterService.idDeviceTypeCommand = deviceCommand.DeviceTypeCommand.Id;

                    forkJoin(
                        this.deviceTypeCommandParameterService.getParameters(),
                        this.deviceCommandParametersService.getParameters()
                    )
                        .pipe(
                            takeUntil(this._destructor2),
                            finalize(() => this.loadingContent = false)
                        )
                        .subscribe((data) => {
                            this.parameters = data[0]
                                .filter((type: IDeviceTypeCommandParameter) => (data[1] || []).find(
                                    (dcp: IDeviceCommandParameter) => dcp.DeviceParameter.Id === type.Id
                                ) == null);
                        }, 
                        (error: any) => {
                            this.errors = [error];
                        });
                },
                (error: any) => {
                    this.errors = [error];
                }
            );
    }

    ngOnDestroy(): void {
        this._destructor.next();
        this._destructor.complete();
        this._destructor2.next();
        this._destructor2.complete();
    }

    onItemClick(event: any) {
        const selectedType =  event.Data;

        sessionStorage.setItem(sessionStorageKey, JSON.stringify(selectedType));

        const url = `commands-module/logic-device/${this.idLogicDevice}/logic-device-command/${this.idLogicDeviceCommand}/device-command/${this.idDeviceCommand}/parameter/new`;
        this.router.navigate([url]);
    }
}
