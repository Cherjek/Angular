import { AppLocalization } from 'src/app/common/LocaleRes';
import { DataQuerySettingsService } from './../../../../services/data-query/data-query-settings.service';
import { InlineGridComponent } from 'src/app/shared/rom-forms/inline-grid/inline-grid.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestCardComponent } from './components/request-card/request-card.component';
import { RequestCardDataqueueComponent } from './components/request-card-dataqueue/request-card-dataqueue.component';
import { RequestCardCommandsComponent } from './components/request-card-commands/request-card-commands.component';
import { CanAccessGuard } from 'src/app/core';
import { DeviceTypePropertiesComponent } from './components/device-type-properties/device-type-properties.component';
import { RequestCardPropertyComponent } from './components/request-card-property/request-card-property.component';
import { DataQueryMainService } from 'src/app/services/data-query';

const routes: Routes = [{
    path: '',
    component: RequestCardComponent,
    children: [
        { path: '', redirectTo: 'property' },
        {
            path: 'property',
            component: RequestCardPropertyComponent,
            data: { access: 'CFG_DEVICE_VIEW', noAccessNavigateTo: 'data-queue' },
            canActivate: [CanAccessGuard]
        },
        {
            path: 'data-queue',
            component: RequestCardDataqueueComponent,
            data: { access: 'CFG_DEVICE_VIEW_QUERIES', noAccessNavigateTo: 'logic-devices' },
            canActivate: [CanAccessGuard]
        },
        {
            path: 'tags',
            component: InlineGridComponent,
            data: {
                service: DataQuerySettingsService,
                subServices: [
                    {
                        service: DataQueryMainService,
                        getMethod: 'getDataQueryTypes',
                        columnNames: ['DataQueryType']
                    },
                    {
                        service: DataQueryMainService,
                        getMethod: 'getValueTypes',
                        columnNames: ['ValueType']
                    },
                    {
                        service: DataQueryMainService,
                        getMethod: 'getTimeStampTypes',
                        columnNames: ['TimeStampType']
                    },
                ],
                columns: [
                    {
                        Name: 'Code',
                        Caption: AppLocalization.Code,
                        MaxLength: 50,
                        IsRequired: true,
                    },
                    {
                        Name: 'Name',
                        Caption: AppLocalization.Name,
                        MaxLength: 150,
                        IsRequired: true,
                    },
                    {
                        Name: 'Ratio',
                        Caption: AppLocalization.Factor,
                        MaxLength: 50,
                        IsRequired: true,
                        InputType: 'float',
                    },
                    {
                        Name: 'Offset',
                        Caption: AppLocalization.Offset,
                        MaxLength: 50,
                        IsRequired: true,
                        InputType: 'float',
                    },
                    {
                        Name: 'ValueType',
                        Caption: AppLocalization.ValueType,
                        MaxLength: 50,
                        IsRequired: true,
                        Type: 'Option'
                    },
                    {
                        Name: 'TimeStampType',
                        Caption: AppLocalization.TimeStampType,
                        MaxLength: 150,
                        IsRequired: true,
                        Type: 'Option'
                    },
                    {
                        Name: 'ValueMinimum',
                        Caption: AppLocalization.Minimum,
                        MaxLength: 50,
                        InputType: 'float',
                    },
                    {
                        Name: 'ValueMaximum',
                        Caption: AppLocalization.Maximum,
                        MaxLength: 50,
                        InputType: 'float',
                    },
                    {
                        Name: 'DataQueryType',
                        Caption: AppLocalization.RequestType,
                        MaxLength: 150,
                        IsRequired: true,
                        Type: 'Option'
                    },
                ],
                access: 'CFG_DEVICE_VIEW_TAGS'
             },
            canActivate: [CanAccessGuard]
        },
        {
            path: 'commands',
            component: RequestCardCommandsComponent,
            data: { access: 'CFG_DEVICE_VIEW_COMMANDS', noAccessNavigateTo: 'device-type-properties' },
            canActivate: [CanAccessGuard]
        },
        {
            path: 'device-type-properties',
            component: DeviceTypePropertiesComponent,
            data: { access: 'CFG_DEVICE_VIEW_PROPERTIES' },
            canActivate: [CanAccessGuard]
        }
    ],
    data: { access: 'CFG_DEVICE_VIEW' },
    canActivate: [CanAccessGuard]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TypeDeviceCardRoutingModule { }
