import { AppLocalization } from 'src/app/common/LocaleRes';
import { Routes, RouterModule } from '@angular/router';
import { ValidationCreateComponent } from './validation.module/validation.create/validation.create';
import { ValidationQueueComponent } from './validation.module/validation.queue/validation.queue';
import { ValidationResultComponent } from './validation.module/validation.result/validation.result';
import { ValidationResultMainComponent } from './validation.module/validation.result/validation.result.main/validation.result.main';
import { ValidationResultLogComponent } from './validation.module/validation.result/validation.result.log/validation.result.log';
import { ValidationResultObjectsComponent } from './validation.module/validation.result/validation.result.objects/validation.result.objects';
import { ValidationResultSettingsComponent } from './validation.module/validation.result/validation.result.settings/validation.result.settings';
import { ObjectsComponent } from './objects.module/objects/objects';
import { ReportsCreateComponent } from './reports.module/reports.create/reports.create';
import { ReportsQueueComponent } from './reports.module/reports.queue/reports.queue';
import { ReportsResultComponent } from './reports.module/reports.result/reports.result';
import { ReportsResultLogComponent } from './reports.module/reports.result/reports.result.log/reports.result.log';
import { ReportResultObjectsComponent } from './reports.module/reports.result/reports.result.objects/reports.result.objects';
import { DataPresentationCreateComponent } from './datapresentation.module/datapresentation.create/datapresentation.create';
import { DatapresentationResultComponent } from './datapresentation.module/datapresentation.result/datapresentation.result';
import { DatapresentationResultDataComponent } from './datapresentation.module/datapresentation.result/datapresentation.result.data/datapresentation.result.data';
import { DatapresentationResultTagsComponent } from './datapresentation.module/datapresentation.result/datapresentation.result.tags/datapresentation.result.tags';
import { DatapresentationResultCompareTagsComponent } from './datapresentation.module/datapresentation.result.comparetags/datapresentation.result.comparetags';
import { LogicDeviceEditorComponent } from './objecteditors.module/logicdevice.editor/logicdevice.editor';
import { LDEPropertiesComponent } from './objecteditors.module/logicdevice.editor/lde.properties/lde.properties';
import { LDECurrentDataComponent } from './objecteditors.module/logicdevice.editor/lde.currentdata/lde.currentdata';
import { LDETagsComponent } from './objecteditors.module/logicdevice.editor/lde.tags/lde.tags';
import { LogicDeviceTypesComponent } from './objecteditors.module/logicdevice.editor/logicdevice.types/logicdevice.types';
import { TagsSortingComponent } from './objecteditors.module/tags.sorting/tags.sorting';
import { LDETagsEditorComponent } from './objecteditors.module/logicdevice.editor/lde.tagsEditor/lde.tagsEditor';
import { CommandsComponent } from './objecteditors.module/logicdevice.editor/commands/commands.component';
import { ConnectionLDDevicesComponent } from './objecteditors.module/connection.ld.devices/connection.ld.devices';
import { ObjectEditorComponent } from './objecteditors.module/object.editor/object.editor';
import { OELogicDevicesComponent } from './objecteditors.module/object.editor/oe.logicdevices/oe.logicdevices';
import { OEDevicesComponent } from './objecteditors.module/object.editor/oe.devices/oe.devices';
import { OEPropertiesComponent } from './objecteditors.module/object.editor/oe.properties/oe.properties';
import { OECurrentDataComponent } from './objecteditors.module/object.editor/oe.currentdata/oe.currentdata';
import { DeviceEditorComponent } from './objecteditors.module/device.editor/device.editor';
import { DEPropertiesComponent } from './objecteditors.module/device.editor/de.properties/de.properties';
import { DeviceTypesComponent } from './objecteditors.module/device.editor/device.types/device.types';
import { DETypesRequestComponent } from './objecteditors.module/device.editor/de.types-request/de.types-request.component';
import { LoginForm } from './login.module/login.root/login';


import { NotFoundPageComponent } from '../shared/rom-not-found-page/not-found-page/not-found-page.component';
import { AccessDirectiveConfig, CanAccessGuard } from '../core';

import { TestsControlsModuleFactory } from './app-routes-modules';

import { AccessSettingsModuleFactory,
         AdditionallyPropertyCardModuleFactory,
         CategoryPropertyCardModuleFactory,
         DataPresentationModuleFactory,
         HierarchiesModuleFactory,
         HierarchyCardModuleFactory,
         HierarchyMainModuleFactory,
         NodeCardModuleFactory,
         NodeCreateModuleFactory,
         NodeLogicDeviceEditModuleFactory,
         PersonalAccountModuleFactory,
         TypeNodeCardModuleFactory,
         RequestCreateModuleFactory,
         RequestsQueueModuleFactory,
         RequestResultModuleFactory,
         ScheduleResultModuleFactory,
         AdminGroupsModuleFactory,
         AdminGroupModuleFactory,
         AdminUsersModuleFactory,
         AdminUserModuleFactory,
         TypesRequestsModuleFactory,
         FilterReferencesModuleFactory,
         DeviceChannelTypesModuleFactory,
         DevicePropertiesModuleFactory,
         LogicDevicePropertyTypesModuleFactory,
         TypesLogicDevicesModuleFactory,
         TypesLogicDevicesCardModuleFactory,
         LogicTagTypesModuleFactory,
         LogicDeviceKindsCardModuleFactory,
         GeographyModuleFactory,
         SubSystemsModuleFactory,
         FilterCardModuleFactory
} from './app-routes-modules';

import { SchedulesModuleFactory,
         ScheduleCardModuleFactory,
         ScheduleStepsModuleFactory,
         ScheduleHierarchiesEditModuleFactory,
         StepRequestsModuleFactory,
         StepReportsModuleFactory,
         StepManageModuleFactory
} from './app-routes-modules';

import {
    TypesDevicesModuleFactory,
    TypeDeviceCardModuleFactory,
    TypeDeviceCommandModuleFactory,
    TypeDeviceCommandParameterModuleFactory,
    TypeDeviceCommandParameterOptionModuleFactory,

    TypesCommandsLogicDevicesModuleFactory,
    TypesCommandsLogicDevicesCardFactory,
    TypesCommandsLogicDevicesParameterFactory,
    TypesCommandsLogicDevicesOptionFactory,

    CommandCreateModuleFactory,
    CommandModuleFactory,
    AddressBookModuleFactory,
    NotificationsModuleFactory,
    NotificationsCardModuleFactory,
    NotificationsHierarchiesEditModuleFactory,
    TagValueBoundsModuleFactory,
    TagValueBoundsCardModuleFactory,

    LogicDeviceCommandModuleFactory,
    LogicDeviceCommandCreateModuleFactory,
    CommandsDevicesModuleFactory,
    DeviceCommandParameterModuleFactory,
    DeviceCommandParameterCreateModuleFactory,
    DeviceCommandParameterOptionCreateModuleFactory,
    DeviceCommandParameterOptionModuleFactory,
    ManagementsModuleFactory,
    ManagementResultModuleFactory
} from './app-routes-modules';
import { ReferenceImportExportModuleFactory } from './app-routes-modules';
import { JournalSystemEventsMainModuleFactory } from './app-routes-modules';
import { 
        ScriptEditorModuleFactory, 
        ScriptEditorCardModuleFactory 
} from './app-routes-modules';
import { 
        TariffCalculatorMaxPowerModuleFactory, 
        TariffCalculatorAgreementTypesModuleFactory,
        TariffCalculatorPowerLevelTypesModuleFactory,
        TariffCalculatorPriceZonesModuleFactory,
        TariffCalculatorPriceZonesCardModuleFactory,
        TariffCalculatorPriceZonesPeakCardModuleFactory,
        TariffCalculatorOesModuleFactory,
        TariffCalculatorOesCardModuleFactory,
        TariffCalculatorOesDayZoneCardModuleFactory,
        TariffCalculatorRegionsModuleFactory,
        TariffCalculatorRegionsCardModuleFactory,
        TariffCalculatorTransferCardModuleFactory,
        TariffCalculatorSupplyOrgTypesModuleFactory,
        TariffCalculatorLDTariffHistoryCardModuleFactory,
        TariffCalculatorMainQueueModuleFactory,
        TariffCalculatorMainFilterModuleFactory,
        SuppliersMainModuleFactory,
        SuppliersCardModuleFactory,
        SuppliersAdditionCardModuleFactory,
        SuppliersEnergyPriceCardModuleFactory,
        ExportImportQueueModuleFactory,
        ExportImportResultModuleFactory,
        TariffCalculationModuleFactory
} from './app-routes-modules';
import { 
        PropertyUpdateQueueModuleFactory,
        PropertyUpdateResultModuleFactory, 
        PropertyUpdateExportImportCreateModuleFactory,
        PropertyUpdateExportImportTreeModuleFactory,
        ExportImportUnitsTreeModuleFactory
} from './app-routes-modules';
import { 
  PaModuleFactory,
  PaCardModuleFactory,
  PaSubModuleFactory,
  PaSubCardModuleFactory,
  PaSubHierarchyEditModuleFactory,
  PersonalAccountRequestModuleFactory,
  PersonalAccountRequestCardModuleFactory,
  PersonalAccountAppDocTypesCardModuleFactory,
  PaSubDocsModuleFactory,
  PaSubDocsCardModuleFactory
} from './app-routes-modules';
import { Common } from '../common/Constants';
import { LDETariffComponent } from './objecteditors.module/logicdevice.editor/lde.tariff/lde.tariff.component';
import { EntitiesFileAttachComponent } from '../modules/entities-file-attach/entities-file-attach.component';
import { TagsCardComponent } from './objecteditors.module/logicdevice.editor/tags-card/tags-card.component';
import { TagsParamsComponent } from './objecteditors.module/logicdevice.editor/tags-params/tags-params.component';

const modConstant = Common.Constants.ModulePaths;
const MAINMENU_ROUTES: Routes = [
    // full : makes sure the path is absolute path
    { path: '', redirectTo: '/hierarchy-main', pathMatch: 'full'},
    {path: 'login', component: LoginForm},
    {
        path: 'validation/create',
        component: ValidationCreateComponent,
        data: { access: ['DA_ALLOW', 'DA_START'], modulePath: modConstant.DataAnalysis },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'hierarchy/:id/validation/create',
        component: ValidationCreateComponent,
        data: { access: ['DA_ALLOW', 'DA_START'], modulePath: modConstant.DataAnalysis },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'validation/queue', component: ValidationQueueComponent,
        data: { access: 'DA_ALLOW', modulePath: modConstant.DataAnalysis },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'validation/result/:id',
        component: ValidationResultComponent,
        children: [
            {path: '', redirectTo: 'main', pathMatch: 'full', data: {access: 'DA_ALLOW'}},
            {
                path: 'main', component: ValidationResultMainComponent, data: { access: 'DA_ALLOW' },
                canActivate: [CanAccessGuard]
            },
            {
                path: 'log', component: ValidationResultLogComponent, data: { access: ['DA_ALLOW', 'DA_VIEW_LOG'], noAccessNavigateTo: 'objects' },
                canActivate: [CanAccessGuard]
            },
            {
                path: 'objects', component: ValidationResultObjectsComponent, data: { access: 'DA_ALLOW', noAccessNavigateTo: 'settings' },
                canActivate: [CanAccessGuard]
            },
            {
                path: 'settings', component: ValidationResultSettingsComponent, data: { access: 'DA_ALLOW' },
                canActivate: [CanAccessGuard]
            }
        ],
        data: { access: 'DA_ALLOW', modulePath: modConstant.DataAnalysisResult },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'objects', component: ObjectsComponent,
        data: { access: 'MAIN_OBJECT_LIST', modulePath: modConstant.Objects },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'reports/create', component: ReportsCreateComponent,
        data: { access: ['DR_ALLOW', 'DR_START'], modulePath: modConstant.Reports },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'hierarchy/:id/reports/create', component: ReportsCreateComponent,
        data: { access: ['DR_ALLOW', 'DR_START'], modulePath: modConstant.Reports },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'reports/queue', component: ReportsQueueComponent,
        data: { access: 'DR_ALLOW', modulePath: modConstant.ReportsQueue },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'reports/result/:id',
        component: ReportsResultComponent,
        children: [
            { path: '', redirectTo: 'objects', pathMatch: 'full' },
            {
                path: 'log', component: ReportsResultLogComponent, data: { access: ['DR_ALLOW', 'DR_VIEW_LOG'], noAccessNavigateTo: 'objects' },
                canActivate: [CanAccessGuard]
            },
            {
                path: 'objects', component: ReportResultObjectsComponent, data: { access: 'DR_ALLOW' },
                canActivate: [CanAccessGuard]
            }
        ],
        data: { access: 'DR_ALLOW', modulePath: modConstant.ReportResult },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'datapresentation/create', component: DataPresentationCreateComponent,
        data: { access: 'DP_ALLOW', modulePath: modConstant.DataPresentation },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'hierarchy/:id/datapresentation/create',
        loadChildren: DataPresentationModuleFactory,
        data: { access: 'DP_ALLOW', modulePath: modConstant.DataPresentation },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'datapresentation/result',
        component: DatapresentationResultComponent,
        children: [
            {path: '', redirectTo: 'data', pathMatch: 'full'},
            {
                path: 'data', component: DatapresentationResultDataComponent, data: { access: 'DP_ALLOW' },
                canActivate: [CanAccessGuard]
            },
            {
                path: 'tags', component: DatapresentationResultTagsComponent, data: { access: 'DP_ALLOW' },
                canActivate: [CanAccessGuard]
            }
        ],
        data: { access: 'DP_ALLOW', modulePath: modConstant.DataPresentation },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'hierarchy/:id/datapresentation/result',
        component: DatapresentationResultComponent,
        children: [
            {path: '', redirectTo: 'data', pathMatch: 'full'},
            {
                path: 'data', component: DatapresentationResultDataComponent, data: { access: 'DP_ALLOW' },
                canActivate: [CanAccessGuard]
            },
            {
                path: 'tags', component: DatapresentationResultTagsComponent, data: { access: 'DP_ALLOW' },
                canActivate: [CanAccessGuard]
            }
        ],
        data: { access: 'DP_ALLOW', modulePath: modConstant.DataPresentation },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'datapresentation/comparetags',
        component: DatapresentationResultCompareTagsComponent,
        data: { access: 'DP_ALLOW', modulePath: modConstant.DataPresentation },
        canActivate: [CanAccessGuard]
    },

    /*
     * MODULE OBJECT EDITOR/OBJECT CARD
     */
    {
        path: 'object-editor/:id',
        component: ObjectEditorComponent,
        children: [
            {
                path: '', redirectTo: 'logic-devices', pathMatch: 'full'
            },
            {
                path: 'logic-devices',
                component: OELogicDevicesComponent,
                data: {
                    access: [
                        'OC_VIEW_OBJECT_CARD',
                        Object.assign(new AccessDirectiveConfig(), {
                            source: 'Units',
                            value: 'OC_VIEW_OBJECT_EQUIPMENTS'
                        })
                    ],
                    noAccessNavigateTo: 'devices'
                },
                canActivate: [CanAccessGuard]
            },
            {
                path: 'devices',
                component: OEDevicesComponent,
                data: {
                    access: [
                        'OC_VIEW_OBJECT_CARD',
                        Object.assign(new AccessDirectiveConfig(), {
                            source: 'Units',
                            value: 'OC_VIEW_OBJECT_DEVICES'
                        })
                    ],
                    noAccessNavigateTo: 'properties'
                },
                canActivate: [CanAccessGuard]
            },
            {
                path: 'properties',
                component: OEPropertiesComponent,
                data: {
                    access: [
                        'OC_VIEW_OBJECT_CARD',
                        Object.assign(new AccessDirectiveConfig(), {
                            source: 'Units',
                            value: 'OC_VIEW_OBJECT_PROPERTIES'
                        })
                    ],
                    noAccessNavigateTo: 'current-data'
                },
                canActivate: [CanAccessGuard]
            },
            {
                path: 'current-data',
                component: OECurrentDataComponent,
                data: {
                    access: [
                        'OC_VIEW_OBJECT_CARD',
                        Object.assign(new AccessDirectiveConfig(), {
                            source: 'Units',
                            value: 'OC_VIEW_OBJECT_DATA'
                        })
                    ]
                },
                canActivate: [CanAccessGuard]
            },
            {
              path: 'files',
              component: EntitiesFileAttachComponent,
              data: {
                  access: [
                      'OC_VIEW_OBJECT_CARD',
                      Object.assign(new AccessDirectiveConfig(), {
                          source: 'Units',
                          value: 'OC_VIEW_OBJECT_ATTACHMENTS'
                      })
                  ],
                  entity: 'units'
              },
              canActivate: [CanAccessGuard]
          }
        ],
        data: { access: 'OC_VIEW_OBJECT_CARD', modulePath: modConstant.ObjectCard },
        canActivate: [CanAccessGuard]
    },

    {
        path: 'ld-editor/:id',
        component: LogicDeviceEditorComponent,
        children: [
            { path: '', redirectTo: 'properties', pathMatch: 'full' },
            // { path: 'current-data', component: LDECurrentDataComponent },
            {
                path: 'properties',
                component: LDEPropertiesComponent,
                data: {
                    access: [
                        'OC_VIEW_OBJECT_CARD',
                        Object.assign(new AccessDirectiveConfig(), {
                            source: 'LogicDevices',
                            value: 'OC_VIEW_EQUIPMENT_CARD'
                        }),
                        Object.assign(new AccessDirectiveConfig(), {
                            source: 'LogicDevices',
                            value: 'OC_VIEW_EQUIPMENT_PROPERTIES'
                        })
                    ],
                    noAccessNavigateTo: 'tags'
                },
                canActivate: [CanAccessGuard]
            },
            {
                path: 'tags',
                component: LDETagsComponent,
                data: {
                    access: [
                        'OC_VIEW_OBJECT_CARD',
                        Object.assign(new AccessDirectiveConfig(), {
                            source: 'LogicDevices',
                            value: 'OC_VIEW_EQUIPMENT_CARD'
                        }),
                        Object.assign(new AccessDirectiveConfig(), {
                            source: 'LogicDevices',
                            value: 'OC_VIEW_EQUIPMENT_TAGS'
                        })
                    ]
                },
                canActivate: [CanAccessGuard]
            },
            {
                path: 'ld-types',
                component: LogicDeviceTypesComponent,
                data: {
                    access: [
                        'OC_VIEW_OBJECT_CARD',
                        Object.assign(new AccessDirectiveConfig(), {
                            source: 'LogicDevices',
                            value: 'OC_VIEW_EQUIPMENT_CARD'
                        })
                    ]
                },
                canActivate: [CanAccessGuard]
            },
            {
                path: 'commands',
                component: CommandsComponent,
                data: { access: ['OC_VIEW_OBJECT_CARD', 'OE_VIEW_COMMANDS'] },
                canActivate: [CanAccessGuard]
            },
            {
                path: 'current-data',
                component: LDECurrentDataComponent,
                data: {
                    access: [
                        'OC_VIEW_OBJECT_CARD',
                        Object.assign(new AccessDirectiveConfig(), {
                            source: 'LogicDevices',
                            value: 'OC_VIEW_EQUIPMENT_DATA'
                        })
                    ]
                },
                canActivate: [CanAccessGuard]
            },
            {
                path: 'tariff',
                component: LDETariffComponent,
                data: { access: 'TC_LOGIC_DEVICE_TARIFF_VIEW' },
                canActivate: [CanAccessGuard]
            },
            {
              path: 'files',
              component: EntitiesFileAttachComponent,
              data: {
                  access: [
                      'OC_VIEW_OBJECT_CARD',
                      Object.assign(new AccessDirectiveConfig(), {
                          source: 'LogicDevices',
                          value: 'OC_VIEW_EQUIPMENT_ATTACHMENTS'
                      })
                  ],
                  entity: 'ld'
              },
              canActivate: [CanAccessGuard]
            }
        ],
        data: { access: ['OC_VIEW_OBJECT_CARD'], modulePath: modConstant.LogicDeviceCard },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'ld-editor/:logicDeviceId/tariff/:id',
        loadChildren: TariffCalculatorLDTariffHistoryCardModuleFactory,
        data: { modulePath: modConstant.LogicDeviceCard }
    },

    {
        path: 'lde-tags-sorting/:id',
        component: TagsSortingComponent,
        data: {
            access: [
                'OC_VIEW_OBJECT_CARD',
                Object.assign(new AccessDirectiveConfig(), {
                    source: 'LogicDevices',
                    value: 'OC_VIEW_EQUIPMENT_CARD'
                }),
                Object.assign(new AccessDirectiveConfig(), {
                    source: 'LogicDevices',
                    value: 'OC_VIEW_EQUIPMENT_TAGS'
                })
            ],
            modulePath: modConstant.TagsSort
        },
        canActivate: [CanAccessGuard]
    },

    {
        path: 'lde-tags-editor/:id',
        component: LDETagsEditorComponent,
        data: {
            access: [
                'OC_VIEW_OBJECT_CARD',
                Object.assign(new AccessDirectiveConfig(), {
                    source: 'LogicDevices',
                    value: 'OC_VIEW_EQUIPMENT_CARD'
                }),
                Object.assign(new AccessDirectiveConfig(), {
                    source: 'LogicDevices',
                    value: 'OC_VIEW_EQUIPMENT_TAGS'
                })
            ],
            modulePath: modConstant.TagsEdit
        },
        canActivate: [CanAccessGuard]
    },

    {
      path: 'lde-tags-card/:id',
      component: TagsCardComponent,
      children: [
        { path: '', redirectTo: 'properties', pathMatch: 'full' },
        // { path: 'current-data', component: LDECurrentDataComponent },
        {
            path: 'properties',
            component: LDETagsEditorComponent,
            data: {
              mode: 'child'
            //     access: [
            //         'OC_VIEW_OBJECT_CARD',
            //         Object.assign(new AccessDirectiveConfig(), {
            //             source: 'LogicDevices',
            //             value: 'OC_VIEW_EQUIPMENT_CARD'
            //         }),
            //         Object.assign(new AccessDirectiveConfig(), {
            //             source: 'LogicDevices',
            //             value: 'OC_VIEW_EQUIPMENT_PROPERTIES'
            //         })
            //     ],
            //     noAccessNavigateTo: 'tags'
            },
            // canActivate: [CanAccessGuard]
        },
        {
            path: 'params',
            component: TagsParamsComponent,
            // data: {
            //     access: [
            //         'OC_VIEW_OBJECT_CARD',
            //         Object.assign(new AccessDirectiveConfig(), {
            //             source: 'LogicDevices',
            //             value: 'OC_VIEW_EQUIPMENT_CARD'
            //         }),
            //         Object.assign(new AccessDirectiveConfig(), {
            //             source: 'LogicDevices',
            //             value: 'OC_VIEW_EQUIPMENT_TAGS'
            //         })
            //     ]
            // },
            // canActivate: [CanAccessGuard]
        }
      ],
      // data: {
      //     access: [
      //         'OC_VIEW_OBJECT_CARD',
      //         Object.assign(new AccessDirectiveConfig(), {
      //             source: 'LogicDevices',
      //             value: 'OC_VIEW_EQUIPMENT_CARD'
      //         }),
      //         Object.assign(new AccessDirectiveConfig(), {
      //             source: 'LogicDevices',
      //             value: 'OC_VIEW_EQUIPMENT_TAGS'
      //         })
      //     ],
      //     modulePath: modConstant.TagsEdit
      // },
      // canActivate: [CanAccessGuard]
    },

    {
        path: 'connection-ld-devices',
        component: ConnectionLDDevicesComponent,
        data: { access: ['OC_VIEW_OBJECT_CARD'], modulePath: modConstant.Devices },
        canActivate: [CanAccessGuard]
    },

    {
        path: 'device-editor/:id',
        component: DeviceEditorComponent,
        children: [
            { path: '', redirectTo: 'properties', pathMatch: 'full' },
            {
                path: 'properties',
                component: DEPropertiesComponent,
                data: {
                    queryParam: 'unitId',
                    access: [
                        'OC_VIEW_OBJECT_CARD',
                        Object.assign(new AccessDirectiveConfig(), {
                            source: 'Units',
                            value: 'OC_VIEW_DEVICE_CARD'
                        }),
                        Object.assign(new AccessDirectiveConfig(), {
                            source: 'Units',
                            value: 'OC_VIEW_DEVICE_PROPERTIES'
                        })
                    ]
                },
                canActivate: [CanAccessGuard]
            },
            {
                path: 'device-types',
                component: DeviceTypesComponent,
                data: {
                    queryParam: 'unitId',
                    access: [
                        'OC_VIEW_OBJECT_CARD',
                        Object.assign(new AccessDirectiveConfig(), {
                            source: 'Units',
                            value: 'OC_VIEW_DEVICE_CARD'
                        })
                    ]
                },
                canActivate: [CanAccessGuard]
            },
            {
                path: 'device-types-request',
                component: DETypesRequestComponent,
                data: { access: 'OE_VIEW_QUERY' },
                canActivate: [CanAccessGuard]
            },
            {
              path: 'files',
              component: EntitiesFileAttachComponent,
              data: {
                  access: [
                      'OC_VIEW_OBJECT_CARD',
                      // Object.assign(new AccessDirectiveConfig(), {
                      //     source: 'Units',
                      //     value: 'OC_VIEW_DEVICE_ATTACHMENTS'
                      // })
                  ],
                  entity: 'devices'
              },
              canActivate: [CanAccessGuard]
            }
        ],
        data: { access: ['OC_VIEW_OBJECT_CARD'], modulePath: modConstant.DevicesCard },
        canActivate: [CanAccessGuard]
    },
    /*
     * END MODULE OBJECT EDITOR/OBJECT CARD
     *
     */


    /* TEST */
    {
        path: 'test-page',
        loadChildren: TestsControlsModuleFactory,
        data: {modulePath: modConstant.Test}
    },

    /* ADMIN */
    {
        path: 'admin/groups',
        loadChildren: AdminGroupsModuleFactory,
        canActivate: [CanAccessGuard],
        data: {modulePath: modConstant.Admin}
    },
    {
        path: 'admin/group/:id',
        loadChildren: AdminGroupModuleFactory,
        canActivate: [CanAccessGuard],
        data: {modulePath: modConstant.Admin}
    },
    {
        path: 'admin/users',
        loadChildren: AdminUsersModuleFactory,
        canActivate: [CanAccessGuard],
        data: {modulePath: modConstant.Admin}
    },
    {
        path: 'admin/user/:id',
        loadChildren: AdminUserModuleFactory,
        canActivate: [CanAccessGuard],
        data: {modulePath: modConstant.Admin}
    },

    {
        path: 'access',
        loadChildren: AccessSettingsModuleFactory,
        data: { access: 'ADM_GROUPS_ALLOW', modulePath: modConstant.Admin },
        //canLoad: [CanAccessGuard],
        canActivate: [CanAccessGuard]
    },


    /* PERSONAL ACCOUNT MODULE */
    {
        path: 'personal-account',
        loadChildren: PersonalAccountModuleFactory,
        data: { access: 'PA_ALLOW', modulePath: modConstant.PersonalAccount },
        canActivate: [CanAccessGuard]
    },

    /* ADDITIONALLY HIERARCHIES */
    {
        path: 'hierarchies-module/hierarchies',
        loadChildren: HierarchiesModuleFactory,
        data: { access: 'HH_SETTINGS', modulePath: modConstant.Hierarchy },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'hierarchies-module/hierarchy-card/:id',
        loadChildren: HierarchyCardModuleFactory,
        data: { access: 'HH_SETTINGS', modulePath: modConstant.Hierarchy },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'hierarchies-module/type-node-card/:id',
        loadChildren: TypeNodeCardModuleFactory,
        data: { access: 'HH_SETTINGS', modulePath: modConstant.Hierarchy },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'hierarchies-module/category-property-card/:id',
        loadChildren: CategoryPropertyCardModuleFactory,
        data: { access: 'HH_SETTINGS', modulePath: modConstant.Hierarchy },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'hierarchies-module/additionally-property-card/:id',
        loadChildren: AdditionallyPropertyCardModuleFactory,
        data: { access: 'HH_SETTINGS', modulePath: modConstant.Hierarchy },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'hierarchies-module/node-card/:id',
        loadChildren: NodeCardModuleFactory,
        data: { access: 'HH_SETTINGS', modulePath: modConstant.Hierarchy },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'hierarchies-module/node-create',
        loadChildren: NodeCreateModuleFactory,
        data: { access: 'HH_SETTINGS', modulePath: modConstant.Hierarchy },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'hierarchies-module/node-logic-devices-edit/:id',
        loadChildren: NodeLogicDeviceEditModuleFactory,
        data: { access: 'HH_SETTINGS', modulePath: modConstant.Hierarchy },
        canActivate: [CanAccessGuard]
    },
    /*
     * ADDITIONALLY HIERARCHIES
     */
    {
        path: 'hierarchy-main',
        loadChildren: HierarchyMainModuleFactory,
        data: { access: [
            Object.assign(new AccessDirectiveConfig(), {
                arrayOperator: 'Or',
                value: ['HH_ALLOW', 'HH_ALLOW_PERSONAL']
            })
        ], noAccessNavigateTo: 'objects', modulePath: modConstant.MainWindow},
        canActivate: [CanAccessGuard]
    },
    /**
     * REQUEST MODULE
     *
     */
    {
        path: 'hierarchy/:id/requests-module/request-create',
        loadChildren: RequestCreateModuleFactory,
        data: { access: 'DQ_ALLOW', modulePath: modConstant.Request },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'requests-module/requests-queue',
        loadChildren: RequestsQueueModuleFactory,
        data: { access: ['DQ_ALLOW', 'DQ_VIEW_QUEUE'], modulePath: modConstant.RequestsQueue },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'requests-module/request-result/:id',
        loadChildren: RequestResultModuleFactory,
        data: { access: 'DQ_ALLOW', modulePath: modConstant.RequestResult },
        canActivate: [CanAccessGuard]
    },
    /**
     * SCHEDULE MODULE
     *
     */
    {
        path: 'schedule-module/schedules',
        loadChildren: SchedulesModuleFactory,
        data: { access: 'SDL_ALLOW', modulePath: modConstant.Schedules },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'schedule-module/schedule-card/:id',
        loadChildren: ScheduleCardModuleFactory,
        data: { access: 'SDL_ALLOW', modulePath: modConstant.Schedules },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'schedule-module/schedule-hierarchies-edit/:id',
        loadChildren: ScheduleHierarchiesEditModuleFactory,
        data: { access: 'SDL_ALLOW', modulePath: modConstant.Schedules },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'schedule-module/steps/:idSchedule',
        loadChildren: ScheduleStepsModuleFactory,
        data: { access: 'SDL_ALLOW', modulePath: modConstant.Schedules },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'schedule-module/schedule/:id/step-requests/:idStep/step/:idStepType',
        loadChildren: StepRequestsModuleFactory,
        data: { access: ['SDL_ALLOW', 'SDL_STEP_VIEW'], modulePath: modConstant.Schedules },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'schedule-module/schedule/:id/step-reports/:idStep/step/:idStepType',
        loadChildren: StepReportsModuleFactory,
        data: { access: ['SDL_ALLOW', 'SDL_STEP_VIEW'], modulePath: modConstant.Schedules },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'schedule-module/schedule/:id/step-manage/:idStep/step/:idStepType',
        loadChildren: StepManageModuleFactory,
        data: { access: ['SDL_ALLOW', 'SDL_STEP_VIEW'], modulePath: modConstant.Schedules },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'schedule-module/schedule-result/:id/journal/:idjournal',
        loadChildren: ScheduleResultModuleFactory,
        data: { access: 'SDL_ALLOW', modulePath: modConstant.Schedules },
        canActivate: [CanAccessGuard]
    },
    /**
     * COMMANDS MODULE
     *
     */
    {
        path: 'hierarchy/:id/commands-module/command-create',
        loadChildren: CommandCreateModuleFactory,
        data: { modulePath: AppLocalization.Command }
    },
    // types devices, типы устройств
    {
        path: 'commands-module/types-devices',
        loadChildren: TypesDevicesModuleFactory,
        data: { access: 'CFG_DEVICE_VIEW', modulePath: modConstant.TypesDevices },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'commands-module/types-devices/:id',
        loadChildren: TypeDeviceCardModuleFactory,
        data: { access: 'CFG_DEVICE_VIEW', modulePath: modConstant.TypesDevices },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'commands-module/c/types-devices/:idDeviceType/command/:id',
        loadChildren: TypeDeviceCommandModuleFactory,
        data: { access: 'CFG_DEVICE_VIEW_COMMANDS', modulePath: modConstant.TypesDevices },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'commands-module/p/types-devices/:idDeviceType/command/:idDeviceTypeCommand/parameters/:id',
        loadChildren: TypeDeviceCommandParameterModuleFactory,
        data: { access: 'CFG_DEVICE_VIEW_COMMANDS', modulePath: modConstant.TypesDevices },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'commands-module/o/types-devices/:idDeviceType/command/:idDeviceTypeCommand/parameters/:idDeviceTypeCommandParameter/options/:id',
        loadChildren: TypeDeviceCommandParameterOptionModuleFactory,
        data: { access: 'CFG_DEVICE_VIEW_COMMANDS', modulePath: modConstant.TypesDevices },
        canActivate: [CanAccessGuard]
    },
    // types commands logic-devices
    {
        path: 'commands-module/types-commands-logic-devices',
        loadChildren: TypesCommandsLogicDevicesModuleFactory,
        data: { access: 'REF_LOGIC_DEVICE_VIEW_COMMANDS', modulePath: modConstant.TypesCommandsLogicDevices },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'commands-module/types-commands-logic-devices/:id',
        loadChildren: TypesCommandsLogicDevicesCardFactory,
        data: { access: 'REF_LOGIC_DEVICE_VIEW_COMMANDS', modulePath: modConstant.TypesCommandsLogicDevices },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'commands-module/p/types-commands-logic-devices/:deviceId/parameters/:id',
        loadChildren: TypesCommandsLogicDevicesParameterFactory,
        data: { access: 'REF_LOGIC_DEVICE_VIEW_COMMANDS', modulePath: modConstant.TypesCommandsLogicDevices },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'commands-module/o/types-commands-logic-devices/:deviceId/parameters/:parameterId/options/:id',
        loadChildren: TypesCommandsLogicDevicesOptionFactory,
        data: { access: 'REF_LOGIC_DEVICE_VIEW_COMMANDS', modulePath: modConstant.TypesCommandsLogicDevices },
        canActivate: [CanAccessGuard]
    },
    // types commands devices
    {
        path: 'commands-module/command-types',
        loadChildren: CommandModuleFactory,
        data: { access: 'REF_DEVICE_VIEW_COMMANDS', modulePath: modConstant.CommandTypes },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'commands-module/bounds',
        loadChildren: TagValueBoundsModuleFactory,
        data: { access: 'CFG_TAG_BOUNDS_VIEW', modulePath: modConstant.TagValueBounds },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'commands-module/bounds/:id',
        loadChildren: TagValueBoundsCardModuleFactory,
        data: { modulePath: modConstant.TagValueBounds },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'commands-module/notifications',
        loadChildren: NotificationsModuleFactory,
        data: { access: 'ES_NTF_VIEW', modulePath: modConstant.Notifications },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'commands-module/notifications/:id',
        loadChildren: NotificationsCardModuleFactory,
        data: { modulePath: modConstant.Notifications },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'commands-module/notifications-hierarchies-edit/:id',
        loadChildren: NotificationsHierarchiesEditModuleFactory,
        data: { modulePath: modConstant.Notifications },
        canActivate: [CanAccessGuard]
    },
    // logic-device
    {
        path: 'commands-module/logic-device/:idLogicDevice/command-create',
        loadChildren: LogicDeviceCommandCreateModuleFactory,
        data: { modulePath: modConstant.LogicDeviceCommand }
    },
    {
        path: 'commands-module/logic-device/:idLogicDevice/command/:id',
        loadChildren: LogicDeviceCommandModuleFactory,
        data: { access: 'OE_VIEW_COMMAND', modulePath: modConstant.LogicDeviceCommand },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'commands-module/logic-device/:idLogicDevice/logic-device-command/:idLogicDeviceCommand/device-command/:id',
        loadChildren: CommandsDevicesModuleFactory,
        data: { access: 'OE_VIEW_DEVICE_COMMAND', modulePath: modConstant.CommandDevices },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'commands-module/device-type-parameters/:idLogicDevice/:idLogicDeviceCommand/:idDeviceCommand',
        loadChildren: DeviceCommandParameterCreateModuleFactory,
        data: { access: 'OE_VIEW_DEVICE_COMMAND', modulePath: modConstant.CommandDevices },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'commands-module/logic-device/:idLogicDevice/logic-device-command/:idLogicDeviceCommand/device-command/:idDeviceCommand/parameter/:id',
        loadChildren: DeviceCommandParameterModuleFactory,
        data: { access: 'OE_VIEW_DEVICE_COMMAND', modulePath: modConstant.CommandDevices },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'commands-module/device-command-parameter-option-create/:idDeviceCommandParameter',
        loadChildren: DeviceCommandParameterOptionCreateModuleFactory,
        data: { access: 'OE_VIEW_DEVICE_COMMAND', modulePath: modConstant.CommandDevices },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'commands-module/device-command-parameter-option/:idDeviceCommandParameter/:id',
        loadChildren: DeviceCommandParameterOptionModuleFactory,
        data: { access: 'OE_VIEW_DEVICE_COMMAND', modulePath: modConstant.CommandDevices },
        canActivate: [CanAccessGuard]
    },
    /**
     * MANAGEMENT MODULE
     *
     */
    {
        path: 'management-module/managements-queue',
        loadChildren: ManagementsModuleFactory,
        data: { access: ['CMD_ALLOW', 'CMD_VIEW_QUEUE'], modulePath: modConstant.Management },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'management-module/managements-result/:id',
        loadChildren: ManagementResultModuleFactory,
        data: { access: 'CMD_ALLOW', modulePath: modConstant.Management },
        canActivate: [CanAccessGuard]
    },
    /**
     * References Module
     */
    {
        path: 'references/types-requests',
        loadChildren: TypesRequestsModuleFactory,
        data: { access: 'REF_VIEW_QUERIES', modulePath: modConstant.TypesRequests },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'references/filter-references',
        loadChildren: FilterReferencesModuleFactory,
        data: { access: 'CFG_TAG_FILTERS_VIEW', modulePath: modConstant.FilterReference },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'references/address-book',
        loadChildren: AddressBookModuleFactory,
        data: { access: 'REF_VIEW_ADDRESS_BOOK', modulePath: modConstant.AddressBook },
        canActivate: [CanAccessGuard]
    },

    {
        path: 'references/device-channel-types',
        loadChildren: DeviceChannelTypesModuleFactory,
        data: { access: 'REF_VIEW_CHANNELS', modulePath: modConstant.ChannelTypes },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'references/device-property-types',
        loadChildren: DevicePropertiesModuleFactory,
        data: { access: 'REF_VIEW_DEVICE_PROPERTIES', modulePath: modConstant.DevicePropertyTypes },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'references/logic-device-property-types',
        loadChildren: LogicDevicePropertyTypesModuleFactory,
        data: { access: 'REF_VIEW_LOGIC_DEVICE_PROPERTIES', modulePath: modConstant.LogicDevicePropertyTypes },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'references/logic-tag-types',
        loadChildren: LogicTagTypesModuleFactory,
        data: { access: 'REF_VIEW_LOGIC_DEVICE_TAGS', modulePath: modConstant.LogicTagTypes },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'references/types-logic-devices',
        loadChildren: TypesLogicDevicesModuleFactory,
        data: { access: 'CFG_LOGIC_DEVICE_VIEW', modulePath: modConstant.TypesLogicDevices },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'references/types-logic-devices/:id',
        loadChildren: TypesLogicDevicesCardModuleFactory,
        data: { access: 'CFG_LOGIC_DEVICE_VIEW', modulePath: modConstant.TypesLogicDevices },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'references/types-logic-devices/:logicDeviceId/kinds/:id',
        loadChildren: LogicDeviceKindsCardModuleFactory,
        data: { access: 'CFG_LOGIC_DEVICE_VIEW', modulePath: modConstant.TypesLogicDevices },
        canActivate: [CanAccessGuard]
    },
    {
      path: 'references/geography',
      loadChildren: GeographyModuleFactory,
      data: { access: 'REF_VIEW_GEOGRAPHY', modulePath: modConstant.Geography },
      canActivate: [CanAccessGuard]
    },
    {
        path: 'references/subsystems',
        loadChildren: SubSystemsModuleFactory,
        data: { access: 'REF_VIEW_SUBSYSTEMS', modulePath: modConstant.SubSystems },
    },
    {
        path: 'references/filter-card/:id',
        loadChildren: FilterCardModuleFactory,
        data: { modulePath: modConstant.ReferenceFilter }
    },

    /* Import/Export */
    {
      path: 'import-export/references',
      loadChildren: ReferenceImportExportModuleFactory,
      data: { modulePath: '' }
    },

    /* Journals */
    {
      path: 'journals/events',
      loadChildren: JournalSystemEventsMainModuleFactory,
      data: { modulePath: modConstant.JournalEvents }
    },
    {
        path: 'script-editors',
        loadChildren: ScriptEditorModuleFactory,
        data: { access: 'REF_VIEW_SCRIPTS', modulePath: modConstant.ScriptEditor },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'script-editors/:id',
        loadChildren: ScriptEditorCardModuleFactory,
        data: { access: 'REF_VIEW_SCRIPTS', modulePath: modConstant.ScriptEditor },
        canActivate: [CanAccessGuard]
    },

    /* Tariff Calculation */
    {
      path: 'tariff-calc/suppliers',
      loadChildren: SuppliersMainModuleFactory,
      data: { access: 'TC_SUPPLIER_VIEW', modulePath: modConstant.Suppliers },
      canActivate: [CanAccessGuard]
    },
    {
      path: 'tariff-calc/suppliers/:id',
      loadChildren: SuppliersCardModuleFactory,
      data: { access: 'TC_SUPPLIER_VIEW', modulePath: modConstant.Supplier },
      canActivate: [CanAccessGuard]
    },
    {
      path: 'tariff-calc/suppliers/:supplierId/addition/:id',
      loadChildren: SuppliersAdditionCardModuleFactory,
      data: { modulePath: modConstant.Supplier },
      //canActivate: [CanAccessGuard]
    },
    {
      path: 'tariff-calc/suppliers/:supplierId/energy-price/:id',
      loadChildren: SuppliersEnergyPriceCardModuleFactory,
      data: { modulePath: modConstant.Supplier },
      //canActivate: [CanAccessGuard]
    },
    {
        path: 'tariff-calculator/max-power',
        loadChildren: TariffCalculatorMaxPowerModuleFactory,
        data: { access: 'TC_MAX_POWER_VIEW', modulePath: modConstant.TariffCalc},
        canActivate: [CanAccessGuard]
    },
    {
        path: 'tariff-calculator/agreement-types',
        loadChildren: TariffCalculatorAgreementTypesModuleFactory,
        data: { access: 'TC_AGREEMENT_TYPE_VIEW', modulePath: modConstant.TariffCalc},
        canActivate: [CanAccessGuard]
    },
    {
        path: 'tariff-calculator/power-levels',
        loadChildren: TariffCalculatorPowerLevelTypesModuleFactory,
        data: { access: 'TC_POWER_LEVEL_VIEW', modulePath: modConstant.TariffCalc},
        canActivate: [CanAccessGuard]
    },
    {
        path: 'tariff-calculator/price-zones',
        loadChildren: TariffCalculatorPriceZonesModuleFactory,
        data: { access: 'TC_PRICE_ZONE_VIEW', modulePath: modConstant.TariffCalc},
        canActivate: [CanAccessGuard]
    },
    {
        path: 'tariff-calculator/price-zones/:id',
        loadChildren: TariffCalculatorPriceZonesCardModuleFactory,
        data: { access: 'TC_PRICE_ZONE_VIEW', modulePath: modConstant.TariffCalc},
        canActivate: [CanAccessGuard]
    },
    {
        path: 'tariff-calculator/price-zones/:priceZoneId/peak-hours/:id',
        loadChildren: TariffCalculatorPriceZonesPeakCardModuleFactory,
        data: { access: 'TC_PLAN_PEAK_HOURS_VIEW', modulePath: modConstant.TariffCalc},
        canActivate: [CanAccessGuard]
    },
    {
        path: 'tariff-calculator/oeses',
        loadChildren: TariffCalculatorOesModuleFactory,
        data: { access: 'TC_OES_VIEW', modulePath: modConstant.TariffCalc},
        canActivate: [CanAccessGuard]
    },
    {
        path: 'tariff-calculator/oeses/:id',
        loadChildren: TariffCalculatorOesCardModuleFactory,
        data: { access: 'TC_OES_VIEW', modulePath: modConstant.TariffCalc},
        canActivate: [CanAccessGuard]
    },
    {
        path: 'tariff-calculator/oeses/:oesId/day-zones/:id',
        loadChildren: TariffCalculatorOesDayZoneCardModuleFactory,
        data: { access: 'TC_DAY_ZONE_VIEW', modulePath: modConstant.TariffCalc},
        canActivate: [CanAccessGuard]
    },
    {
        path: 'tariff-calculator/regions',
        loadChildren: TariffCalculatorRegionsModuleFactory,
        data: { access: 'TC_REGION_VIEW', modulePath: modConstant.TariffCalc},
        canActivate: [CanAccessGuard]
    },
    {
        path: 'tariff-calculator/regions/:id',
        loadChildren: TariffCalculatorRegionsCardModuleFactory,
        data: { access: 'TC_REGION_VIEW', modulePath: modConstant.TariffCalc},
        canActivate: [CanAccessGuard]
    },
    {
        path: 'tariff-calculator/regions/:regionId/transfers/:id',
        loadChildren: TariffCalculatorTransferCardModuleFactory,
        data: { access: 'TC_TRANSFER_TARIFF_VIEW', modulePath: modConstant.TariffCalc},
        canActivate: [CanAccessGuard]
    },
    {
        path: 'tariff-calculator/supply-org-types',
        loadChildren: TariffCalculatorSupplyOrgTypesModuleFactory,
        data: { access: 'TC_SUPPLY_ORGANIZATION_VIEW', modulePath: modConstant.TariffCalc },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'tariff-calculator/main',
        loadChildren: TariffCalculatorMainQueueModuleFactory,
        data: { modulePath: modConstant.TariffCalc },
        // canActivate: [CanAccessGuard]
    },
    {
        path: 'tariff-calculator/main/filters/:id',
        loadChildren: TariffCalculatorMainFilterModuleFactory,
        data: { modulePath: modConstant.TariffCalc },
        // canActivate: [CanAccessGuard]
    },
    {
        path: 'tariff-calc/export-import',
        loadChildren: ExportImportQueueModuleFactory,
        data: { modulePath: modConstant.TariffCalc },
        // canActivate: [CanAccessGuard]
    },
    {
        path: 'tariff-calc/export-import/result/:typeId/:id',
        loadChildren: ExportImportResultModuleFactory,
        data: { modulePath: modConstant.TariffCalc },
        // canActivate: [CanAccessGuard]
    },       
    {
      path: 'hierarchy/:id/tariff-calc/create',
      loadChildren: TariffCalculationModuleFactory,
      data: { access: 'TC_START', modulePath: modConstant.TariffCalc },
      canActivate: [CanAccessGuard]
    },

    // Property update
    {
      path: 'property-update/export-import/queue',
      loadChildren: PropertyUpdateQueueModuleFactory,
      data: { access: 'CMG_EXPORT_IMPORT_VIEW_QUEUE', modulePath: modConstant.UPExportImportQueue },
      canActivate: [CanAccessGuard]
    },
    {
        path: 'property-update/export-import/result/:typeId/:id',
        loadChildren: PropertyUpdateResultModuleFactory,
        data: { modulePath: modConstant.UPExportImportResult },
    }, 
    {
      path: 'property-update/export-import/create/:type',
      loadChildren: PropertyUpdateExportImportCreateModuleFactory,
      data: { modulePath: modConstant.UPExportImportCreate },
    }, 
    // {
    //   path: 'property-update/export-import/new-properties/:entity',
    //   loadChildren: PropertyUpdateExportImportTreeModuleFactory,
    //   data: { modulePath: modConstant.UPExportImportChoiceProperty },
    // },
    {
      path: 'property-update/export-import/add-entities/:entityType',
      loadChildren: ExportImportUnitsTreeModuleFactory,
      data: { modulePath: modConstant.UPExportImportChoiceUnits },
    },    

    // Personal account sub
    {
        path: 'sub-personal-account/apps',
        loadChildren: PaModuleFactory,
        data: { access: ['CPA_ALLOW', 'CPA_VIEW_APPS'], modulePath: modConstant.SubPersonalAccount },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'sub-personal-account/apps/:id',
        loadChildren: PaCardModuleFactory,
        data: { access: 'CPA_ALLOW', modulePath: modConstant.SubPersonalAccount },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'sub-personal-account/apps/:appId/doc-types/:id',
        loadChildren: PersonalAccountAppDocTypesCardModuleFactory,
        data: { access: ['CPA_ALLOW', 'CPA_EDIT_APP_DOCUMENT_TYPES'], modulePath: modConstant.SubPersonalAccount },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'sub-personal-account/subscribers',
        loadChildren: PaSubModuleFactory,
        data: { access: ['CPA_ALLOW', 'CPA_VIEW_CUSTOMERS'], modulePath: modConstant.SubPersonalAccount },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'sub-personal-account/subscribers/:id',
        loadChildren: PaSubCardModuleFactory,
        data: { access: 'CPA_ALLOW', modulePath: modConstant.SubPersonalAccount },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'sub-personal-account/documents',
        loadChildren: PaSubDocsModuleFactory,
        data: { access: ['CPA_ALLOW', 'CPA_VIEW_DOCUMENTS'], modulePath: modConstant.SubPersonalAccount },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'sub-personal-account/documents/:id',
        loadChildren: PaSubDocsCardModuleFactory,
        data: { access: ['CPA_ALLOW', 'CPA_VIEW_DOCUMENT'], modulePath: modConstant.SubPersonalAccount },
        canActivate: [CanAccessGuard]
    },
    {
        path: 'sub-personal-account/hierarchy-edit/apps/:id',
        loadChildren: PaSubHierarchyEditModuleFactory,
        data: { access: ['CPA_ALLOW', 'CPA_EDIT_CUSTOMER_NODES'], modulePath: modConstant.SubPersonalAccount },
        canActivate: [CanAccessGuard]
    },
    {
      path: 'sub-personal-account/request',
      loadChildren: PersonalAccountRequestModuleFactory,
      data: { access: ['CPA_ALLOW', 'CPA_VIEW_REQUESTS'], modulePath: `${AppLocalization.PersonalAccountOffice}, ${AppLocalization.Requests}` },
      canActivate: [CanAccessGuard]
    },
    {
      path: 'sub-personal-account/request/:id',
      loadChildren: PersonalAccountRequestCardModuleFactory,
      data: { access: ['CPA_ALLOW', 'CPA_VIEW_REQUEST'], modulePath: `${AppLocalization.PersonalAccountOffice}, ${AppLocalization.Request}` },
      canActivate: [CanAccessGuard]
    },

    {
        path: 'not-found-page',
        component: NotFoundPageComponent,
        data: { modulePath: modConstant.NotFound }
    },
    {
        path: '**', redirectTo: '/not-found-page', pathMatch: 'full'
    }
];
export const CONST_ROUTING = RouterModule.forRoot(MAINMENU_ROUTES);
