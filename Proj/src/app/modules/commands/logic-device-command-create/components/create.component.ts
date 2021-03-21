import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Subject, forkJoin } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { LogicDeviceCommandTypeService } from 'src/app/services/configuration/logic-device-command-type.service';
import { IData } from 'src/app/services/configuration/Models/Data';
import { LogicDeviceCommandsService } from 'src/app/services/configuration/logic-device-commands.service';
import { ILogicDeviceCommand } from 'src/app/services/configuration/Models/LogicDeviceCommand';


export const sessionStorageKey = 'LDCommandCreateComponent.sessionStorageKey';

@Component({
    selector: "ahm-ld-command-create",
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.less'],
    providers: [LogicDeviceCommandTypeService, LogicDeviceCommandsService]
})
export class LDCommandCreateComponent implements OnInit, OnDestroy {
    
    typesSource: any[];
    idLogicDevice: number;
    loadingContent = true;
    errors: any[] = [];
    private _destructor = new Subject();

    constructor(
        private logicDeviceCommandsService: LogicDeviceCommandsService,
        private logicDeviceCommandTypeService: LogicDeviceCommandTypeService,
        public router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.idLogicDevice = this.activatedRoute.snapshot.params.idLogicDevice;
        logicDeviceCommandsService.idLogicDevice = this.idLogicDevice;
    }

    ngOnInit() {      
        forkJoin(
            [this.logicDeviceCommandsService.getLogicDeviceCommands(),
            this.logicDeviceCommandsService.getLogicDeviceCommandsTypes()]
        )
            .pipe(
                takeUntil(this._destructor),
                finalize(() => this.loadingContent = false)
            )
            .subscribe(
                (types: any[]) => {
                    this.typesSource = types[1].filter((type: IData) => 
                        (types[0] || []).find((ldc: ILogicDeviceCommand) => ldc.CommandType.Id === type.Id) == null);
                },
                (error: any) => {
                    this.errors = [error];
                }
            );
    }

    ngOnDestroy(): void {
        this._destructor.next();
        this._destructor.complete();
    }

    onItemClick(event: any) {
        const selectedType =  event.Data as IData;

        sessionStorage.setItem(sessionStorageKey, JSON.stringify(selectedType));
        this.router.navigate([`commands-module/logic-device/${this.idLogicDevice}/command/new`]);
    }
}
