import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceCommandParametersService } from 'src/app/services/configuration/device-command-parameters.service';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { IDeviceCommandParameter } from 'src/app/services/configuration/Models/DeviceCommandParameter';
import { LogicDeviceTypeCommandParameterOptionService } from 'src/app/services/commands/Configuration/logic-device-type-command-parameter-option.service';
import { ILogicDeviceCommandTypeParameterOption } from 'src/app/services/commands/Models/LogicDeviceCommandTypeParameterOption';
import { DeviceCommandParameterOptionsService } from 'src/app/services/configuration/device-command-parameter-options.service';
import { IDeviceCommandParameterOption } from 'src/app/services/configuration/Models/DeviceCommandParameterOption';

export const sessionStorageKey = 'OptionsComponent.sessionStorageKey';

@Component({
    selector: 'rom-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.less']
})
export class OptionsComponent implements OnInit, OnDestroy {

    errors: any[] = [];
    loadingContent = true;
    private _destructor = new Subject();
    private _destructor2 = new Subject();

    options: ILogicDeviceCommandTypeParameterOption[];
    
    idDeviceCommandParameter: number;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private deviceCommandParameterOptionsService: DeviceCommandParameterOptionsService,
        private logicDeviceTypeCommandParameterOptionService: LogicDeviceTypeCommandParameterOptionService,
        private deviceCommandParametersService: DeviceCommandParametersService
    ) {
        this.deviceCommandParametersService.idDeviceCommand = 0;
        this.idDeviceCommandParameter = this.activatedRoute.parent.snapshot.params.idDeviceCommandParameter;
        this.deviceCommandParameterOptionsService.idDeviceCommandParameter = this.idDeviceCommandParameter;
    }

    ngOnInit() {
        this.deviceCommandParametersService
            .getParameter(this.idDeviceCommandParameter)
            .pipe(takeUntil(this._destructor))
            .subscribe((param: IDeviceCommandParameter) => {

                if (!param.LogicDeviceParameter) {
                    this.loadingContent = false;
                    return;
                }

                this.logicDeviceTypeCommandParameterOptionService.idDeviceType = 0;
                this.logicDeviceTypeCommandParameterOptionService.idParameter = param.LogicDeviceParameter.Id;

                forkJoin(
                    this.deviceCommandParameterOptionsService.getOptions(),
                    this.logicDeviceTypeCommandParameterOptionService.getDeviceTypeCommandParameterOptions()
                )
                    .pipe(takeUntil(this._destructor2), finalize(() => this.loadingContent = false))
                    .subscribe((data) => { 
                        this.options = (data[1] as ILogicDeviceCommandTypeParameterOption[]).filter(
                            (option) => (data[0] as IDeviceCommandParameterOption[]).find(
                                (dco: IDeviceCommandParameterOption) => dco.LogicDeviceOption.Id === option.Id
                            ) == null
                        );
                    }, (error: any) => {
                        this.errors = [error];
                    })
                

            }, (error: any) => {
                this.errors = [error];
            });
    }

    ngOnDestroy() {
        this._destructor.next();
        this._destructor.complete();
        this._destructor2.next();
        this._destructor2.complete();
    }

    onItemClick(event: any) {
        const selectedType =  event.Data;

        sessionStorage.setItem(sessionStorageKey, JSON.stringify(selectedType));

        const url = `commands-module/device-command-parameter-option/${this.idDeviceCommandParameter}/new`;
        this.router.navigate([url]);
    }

}
