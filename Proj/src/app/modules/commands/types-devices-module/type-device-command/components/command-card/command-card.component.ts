import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ContextButtonItem,
  ContextButtonItemConfirm
} from 'src/app/controls/ContextButton/ContextButtonItem';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { Subscription, forkJoin } from 'rxjs';
import { DeviceTypeCommandsService } from 'src/app/services/configuration/device-type-commands.service';
import { GlobalValues, PermissionCheckUtils } from 'src/app/core';
import { DataQuerySettingsService } from 'src/app/services/data-query';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'rom-command-card',
  templateUrl: './command-card.component.html',
  styleUrls: ['./command-card.component.less']
})
export class CommandCardComponent implements OnInit, OnDestroy {
  commandPath: string;
  commandId: string | number;
  idDeviceType: number;
  subscription: Subscription;
  public loadingPanel: boolean;
  public headerErrors: any[] = [];
  public get isNew() {
    return this.commandId === 'new';
  }
  public contextButtonItems: ContextButtonItem[];
  public menuItems: NavigateItem[] = [
    {
      code: 'property',
      url: 'property',
      name: AppLocalization.Properties
      // access: 'HH_TYPE_PROPERTY_VIEW'
    },
    {
      code: 'params',
      url: 'params',
      name: AppLocalization.Options
      // access: 'HH_TYPE_PROPERTY_VIEW'
    }
  ];

  constructor(
    public activatedRoute: ActivatedRoute,
    private deviceTypeCommandsService: DeviceTypeCommandsService,
    private dataQuerySettingsService: DataQuerySettingsService,
    private permissionCheckUtils: PermissionCheckUtils
  ) {
    this.subscription = this.activatedRoute.parent.params
      .pipe(
        map(params => {
          this.commandId = params.id;
          this.idDeviceType = params.idDeviceType;
          deviceTypeCommandsService.idDeviceType = this.idDeviceType;
          return [params.id, params.idDeviceType];
        }),
        mergeMap(ids =>
          forkJoin({
            command: deviceTypeCommandsService.getCommand(ids[0]),
            settings: this.dataQuerySettingsService.getDeviceType(ids[1])
          })
        )
      )
      .subscribe(result => {
        this.commandPath =
          ((result.settings || {} as any).Name || '') +
          ' , ' +
          ((result.settings || {} as any).Code || '') +
          ' , ' +
          ((result.command.DeviceCommandType || {} as any).Name || '');
      });
  }

  ngOnInit() {
    this.permissionCheckUtils
          .getAccess([
            'CFG_DEVICE_EDIT_COMMANDS'
          ], [
            {
              code: 'delete',
              name: AppLocalization.Delete,
              confirm: new ContextButtonItemConfirm(
                AppLocalization.DeleteConfirm,
                AppLocalization.Delete
              )
            }
          ])
          .subscribe(result => this.contextButtonItems = result);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    contextButtonHeaderClick(code: string) {
        this.loadingPanel = true;
        let promise: Promise<any> = null;
        let callback: any;
        if (code === 'delete') {
          promise = this.deviceTypeCommandsService.deleteCommand(this.commandId as number);
          callback = (result: any) => {
            if (!result) {
              GlobalValues.Instance.Page.backwardButton.navigate();
            }
          };
        }
        promise
          .then((result: any) => {
            this.loadingPanel = false;
            callback(result);
          })
          .catch((error: any) => {
            this.loadingPanel = false;
            this.headerErrors = [error];
          });
      }
}
