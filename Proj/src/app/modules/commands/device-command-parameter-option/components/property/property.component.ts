import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { IDeviceTypeCommandParameterOption } from 'src/app/services/configuration/Models/DeviceTypeCommandParameterOption';
import { sessionStorageKey } from '../../../device-command-parameter-option-create/components/options/options.component';
import { DeviceCommandParameterOptionsService } from 'src/app/services/configuration/device-command-parameter-options.service';
import { IDeviceCommandParameterOption } from 'src/app/services/configuration/Models/DeviceCommandParameterOption';
import { Subscription, forkJoin, Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize, takeUntil } from 'rxjs/operators';
import { LogicDeviceCommandTypeParameterOption, 
    ILogicDeviceCommandTypeParameterOption } from 'src/app/services/commands/Models/LogicDeviceCommandTypeParameterOption';
import { GlobalValues } from 'src/app/core';
import { DeviceTypeCommandParameterOptionService } from 'src/app/services/configuration/device-type-command-parameter-option.service';
import { DeviceCommandParametersService } from 'src/app/services/configuration/device-command-parameters.service';
import { IDeviceCommandParameter } from 'src/app/services/configuration/Models/DeviceCommandParameter';

@Component({
    selector: 'rom-property',
    templateUrl: './property.component.html',
    styleUrls: ['./property.component.less']
})
export class PropertyComponent implements OnInit, OnDestroy {

    isPropEdit = false;
    valType = 1;
    propValTypeOne: any;
    propValTypeTwo: IDeviceTypeCommandParameterOption;
    propValTypeTwoArray: IDeviceTypeCommandParameterOption[];

    public loadingContent: boolean;
    public errors: any[] = [];
    public properties: any[] = [];
    errorLoadEntity: any;
    subscription: Subscription;
    option: IDeviceCommandParameterOption;
    optionId: string | number;
    idDeviceCommandParameter: number;
    parameter: IDeviceCommandParameter;
    // idLogicDevice: number;
    // idLogicDeviceCommand: number;
    // idDeviceCommand: number;
    // logicDeviceCommand: ILogicDeviceCommand;

    private _destructor = new Subject();
    private _destructor2 = new Subject();
    
    private _logicDeviceOption: ILogicDeviceCommandTypeParameterOption;
    private get logicDeviceOption() {
        if (this._logicDeviceOption == null) {
            const storage = sessionStorage.getItem(sessionStorageKey);
            this._logicDeviceOption = JSON.parse(storage) as ILogicDeviceCommandTypeParameterOption;
        }
        return this._logicDeviceOption;
    }

    public get isNew() {
        return this.optionId === 'new';
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
        private deviceTypeCommandParameterOptionService: DeviceTypeCommandParameterOptionService,
        private deviceCommandParametersService: DeviceCommandParametersService,
        private deviceCommandParameterOptionsService: DeviceCommandParameterOptionsService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { 
        this.subscription = this.activatedRoute.parent.params.subscribe(params => {
            this.optionId = params.id;
            this.idDeviceCommandParameter = params.idDeviceCommandParameter;
            
            deviceCommandParameterOptionsService.idDeviceCommandParameter = params.idDeviceCommandParameter;
            deviceCommandParametersService.idDeviceCommand = 0;

            this.loadProperty();
        });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this._destructor.next();
        this._destructor.complete();
        this._destructor2.next();
        this._destructor2.complete();
    }

    private loadProperty() {
        this.loadingContent = true;
        forkJoin(
            this.deviceCommandParameterOptionsService.getOption(this.optionId),
            this.deviceCommandParametersService.getParameter(this.idDeviceCommandParameter)
        )
            .pipe(
                takeUntil(this._destructor),
                finalize(() => {
                    this.loadingContent = false;
                })
            )
            .subscribe(
                (data: any[]) => {
                    this.option = data[0];
                    if (this.isNew) {
                        this.option.LogicDeviceOption = this.logicDeviceOption;
                    }
                    this.parameter = data[1];

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
    }
    private initProperties() {
        this.dropEditState();
        if (!this.isNew) {
            this.valType =  this.option.FixedValue != null ? 1 : 2;

            if (this.option.FixedValue != null) {
                this.propValTypeOne = this.option.FixedValue;
            } else if (this.option.DeviceOption != null) {
                this.propValTypeTwo = this.option.DeviceOption;
            }
        }
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
            this.option.FixedValue = `${this.propValTypeOne}`;
            this.option.DeviceOption = null;
        } else if (this.valType === 2) {
            if (this.propValTypeTwo == null) {
                this.errors = [AppLocalization.DontSetAValue];
            }
            this.option.FixedValue = null;
            this.option.DeviceOption = this.propValTypeTwo;
        }
        if (this.errors.length) {
            this.loadingContent = false;
            return;
        }
        this.option.IdDeviceCommandParameter = this.idDeviceCommandParameter;
        this.deviceCommandParameterOptionsService
            .saveOption(this.option)
            .then((optionId: number) => {
                this.loadingContent = false;

                if (this.isNew) {
                    const url = `commands-module/device-command-parameter-option/${this.idDeviceCommandParameter}/${optionId}`;
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
        this.deviceTypeCommandParameterOptionService.idDeviceTypeCommand = 0;
        this.deviceTypeCommandParameterOptionService.idDeviceType = 0;
        this.deviceTypeCommandParameterOptionService.idParameter = this.parameter.DeviceParameter.Id;

        this.deviceTypeCommandParameterOptionService
            .getDeviceTypeCommandParameterOptions()
            .pipe(takeUntil(this._destructor2), finalize(() => this.loadingContent = false))
            .subscribe((options) => this.propValTypeTwoArray = options, (error: any) => {
                this.errors = [error];
            })
    }
}
