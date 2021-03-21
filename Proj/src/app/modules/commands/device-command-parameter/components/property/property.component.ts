import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, HostListener } from '@angular/core';
import { IDeviceCommandParameter } from 'src/app/services/configuration/Models/DeviceCommandParameter';
import { Subscription, forkJoin, of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { LogicDeviceCommandsService } from 'src/app/services/configuration/logic-device-commands.service';
import { ILogicDeviceCommand } from 'src/app/services/configuration/Models/LogicDeviceCommand';
import { finalize } from 'rxjs/operators';
import { DeviceCommandParametersService } from 'src/app/services/configuration/device-command-parameters.service';
import { GlobalValues } from 'src/app/core';
import { LogicDeviceTypeCommandParameterService } from 'src/app/services/commands/Configuration/logic-device-type-command-parameter.service';
import { ILogicDeviceCommandTypeParameter } from 'src/app/services/commands/Models/LogicDeviceCommandTypeParameter';
import { IDeviceTypeCommandParameter } from 'src/app/services/configuration/Models/DeviceTypeCommandParameter';

import { sessionStorageKey } from '../../../device-command-parameter-create/components/device-type-parameters/device-type-parameters.component';

@Component({
    selector: 'rom-property',
    templateUrl: './property.component.html',
    styleUrls: ['./property.component.less']
})
export class PropertyComponent implements OnInit {

    isPropEdit = false;
    valType = 1;
    propValTypeOne: any;
    propValTypeThree: any;
    propValTypeTwo: ILogicDeviceCommandTypeParameter;
    propValTypeTwoArray: ILogicDeviceCommandTypeParameter[];

    public loadingContent: boolean;
    public errors: any[] = [];
    public properties: any[] = [];
    errorLoadEntity: any;
    subscription: Subscription;
    parameter: IDeviceCommandParameter;
    parameterId: string | number;
    idLogicDevice: number;
    idLogicDeviceCommand: number;
    idDeviceCommand: number;
    logicDeviceCommand: ILogicDeviceCommand;
    
    private _deviceTypeParameter: IDeviceTypeCommandParameter;
    private get deviceTypeParameter() {
        if (this._deviceTypeParameter == null) {
            const storage = sessionStorage.getItem(sessionStorageKey);
            this._deviceTypeParameter = JSON.parse(storage) as IDeviceTypeCommandParameter;
        }
        return this._deviceTypeParameter;
    }

    public get isNew() {
        return this.parameterId === 'new';
    }

    @HostListener('document:keydown', ['$event']) onKeyDownFilter(event: KeyboardEvent) {
        if (event.ctrlKey) {
            // Ctrl + s = save
            if (event.keyCode === 83) {
                event.preventDefault();
                this.saveEntity();
            }
        } else {
            if (event.keyCode === 27) {
                this.cancel();
            }
        }
    }

    constructor(
        private deviceCommandParametersService: DeviceCommandParametersService,
        private logicDeviceCommandsService: LogicDeviceCommandsService,
        private logicDeviceTypeCommandParameterService: LogicDeviceTypeCommandParameterService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { 
        this.subscription = this.activatedRoute.parent.params.subscribe(params => {
            this.parameterId = params.id;
            this.idLogicDevice = params.idLogicDevice;
            this.idLogicDeviceCommand = params.idLogicDeviceCommand;
            this.idDeviceCommand = params.idDeviceCommand;

            logicDeviceCommandsService.idLogicDevice = params.idLogicDevice;
            deviceCommandParametersService.idDeviceCommand = params.idDeviceCommand;

            this.loadProperty();
        });
    }

    ngOnInit() {
    }

    private loadProperty() {
        this.loadingContent = true;
        forkJoin(
            this.logicDeviceCommand ? of(this.logicDeviceCommand) : 
                this.logicDeviceCommandsService.getLogicDeviceCommand(this.idLogicDeviceCommand),
            this.deviceCommandParametersService.getParameter(this.parameterId)
        )
            .pipe(
                finalize(() => {
                    this.loadingContent = false;
                })
            )
            .subscribe(
                (data: any[]) => {
                    this.logicDeviceCommand = (data[0] as ILogicDeviceCommand);
                    this.parameter = data[1];
                    if (this.isNew) {
                        this.parameter.DeviceParameter = this.deviceTypeParameter;
                    }

                    this.isPropEdit = this.isNew;
                    this.initProperties();
                },
                (error: any) => {
                    this.errors = [error];
                    this.errorLoadEntity = error;
                }
            );
    }

    private dropEditState() {
        this.valType = 1;
        this.propValTypeOne = null;
        this.propValTypeTwo = null;
        this.propValTypeThree = null;
    }
    private initProperties() {
        this.dropEditState();
        if (!this.isNew) {
            this.valType =  this.parameter.FixedValue != null ? 1 :
                            this.parameter.LogicDeviceParameter != null ? 2 : 3;

            if (this.parameter.FixedValue != null) {
                this.propValTypeOne = this.parameter.FixedValue;
            } else if (this.parameter.LogicDeviceParameter != null) {
                this.propValTypeTwo = this.parameter.LogicDeviceParameter;
            }
        }
        this.propValTypeThree = this.parameter.DeviceParameter.DefaultValue;
    }

    public changeProperties() {
        this.isPropEdit = true;
    }

    private cancelChangeProperty() {
        this.isPropEdit = false;
    }

    private rollBackProperty() {
        this.initProperties();
    }

    public cancel() {
        if (this.isNew) {
            // redirect to back page
            this.back2Objects();
        } else {
            this.rollBackProperty();
            this.cancelChangeProperty();
        }
    }

    public saveEntity() {
        this.errors = [];
        this.loadingContent = true;
        if (this.valType === 1) {
            if (this.propValTypeOne == null ||
                this.propValTypeOne === '') {
                this.errors = [AppLocalization.DontSetAValue];
            }
            this.parameter.FixedValue = `${this.propValTypeOne}`;
            this.parameter.LogicDeviceParameter = null;
        } else if (this.valType === 2) {
            if (this.propValTypeTwo == null) {
                this.errors = [AppLocalization.DontSetAValue];
            }
            this.parameter.FixedValue = null;
            this.parameter.LogicDeviceParameter = this.propValTypeTwo;
        } else {
            this.parameter.LogicDeviceParameter = null;
            this.parameter.FixedValue = null;
        }
        if (this.errors.length) {
            this.loadingContent = false;
            return;
        }
        this.deviceCommandParametersService
            .saveParameter(this.parameter)
            .then((paramId: number) => {
                this.loadingContent = false;

                if (this.isNew) {
                    const url = `commands-module/logic-device/${this.idLogicDevice}/logic-device-command/${this.idLogicDeviceCommand}/device-command/${this.idDeviceCommand}/parameter/${paramId}`;
                    this.router.navigate([url], {
                        // queryParamsHandling: 'preserve',
                        // relativeTo: this.activatedRoute
                    });
                } else {
                    this.loadProperty();
                }
            })
            .catch((error: any) => {
                this.loadingContent = false;
                this.errors = [error];
            });
    }

    public back2Objects() {
        if (this.isNew) {
            GlobalValues.Instance.Page.backwardButton.popLastUrl();
        }
        GlobalValues.Instance.Page.backwardButton.navigate();
    }

    public eventDropDown() {
        if (this.propValTypeTwoArray == null) {
            this.logicDeviceTypeCommandParameterService.idDeviceTypeCommand = this.logicDeviceCommand.CommandType.Id;
            this.logicDeviceTypeCommandParameterService.getParameters()
                .subscribe(
                    (parameters) => {
                        this.propValTypeTwoArray = parameters;
                    },
                    (error: any) => {
                        this.errors = [error];
                    }
                );
        }
    }
}
