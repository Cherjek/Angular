// tslint:disable:max-line-length

/**
 * TESTS CONTROLS
 *
 */
export function TestsControlsModuleFactory() {
  return import('../modules/tests-controls/tests-controls.module').then(
    (m) => m.TestsControlsModule
  );
}

export function FilterCardModuleFactory() {
  return import(
    '../modules/references/telemechanics/filter-card/filter-card.module'
  ).then((m) => m.FilterCardModule);
}

/**
 * PERSONAL ACCOUNT MODULE
 */
export function PersonalAccountModuleFactory() {
  return import('../modules/personal-account/personal-account.module').then(
    (m) => m.PersonalAccountModule
  );
}

/**
 * ADMIN MODULE
 */

export function AccessSettingsModuleFactory() {
  return import('../modules/access-settings/access-settings.module').then(
    (m) => m.AccessSettingsModule
  );
}

export function AdminGroupsModuleFactory() {
  return import(
    '../modules/admin.module/admin.groups/admin.groups.module'
  ).then((m) => m.AdminGroupsModule);
}
export function AdminGroupModuleFactory() {
  return import('../modules/admin.module/admin.group/admin.group.module').then(
    (m) => m.AdminGroupModule
  );
}
export function AdminUsersModuleFactory() {
  return import('../modules/admin.module/admin.users/admin.users.module').then(
    (m) => m.AdminUsersModule
  );
}
export function AdminUserModuleFactory() {
  return import('../modules/admin.module/admin.user/admin.user.module').then(
    (m) => m.AdminUserModule
  );
}

/**
 * DATA PRESENT MODULE
 */

export function DataPresentationModuleFactory() {
  return import('../modules/data-presentation/data-presentation.module').then(
    (m) => m.DataPresentationModule
  );
}

/**
 * HIERARCHY MODULE
 */

export function HierarchyMainModuleFactory() {
  return import('../modules/hierarchy-main/hierarchy-main.module').then(
    (m) => m.HierarchyMainModule
  );
}

export function AdditionallyPropertyCardModuleFactory() {
  return import(
    '../modules/additionally-hierarchies/additionally-property-card/additionally-property-card.module'
  ).then((m) => m.AdditionallyPropertyCardModule);
}

export function CategoryPropertyCardModuleFactory() {
  return import(
    '../modules/additionally-hierarchies/category-property-card/category-property-card.module'
  ).then((m) => m.CategoryPropertyCardModule);
}

export function HierarchiesModuleFactory() {
  return import(
    '../modules/additionally-hierarchies/hierarchies/hierarchies.module'
  ).then((m) => m.HierarchiesModule);
}

export function HierarchyCardModuleFactory() {
  return import(
    '../modules/additionally-hierarchies/hierarchy-card/hierarchy-card.module'
  ).then((m) => m.HierarchyCardModule);
}

export function NodeCardModuleFactory() {
  return import(
    '../modules/additionally-hierarchies/node-card/node-card.module'
  ).then((m) => m.NodeCardModule);
}

export function NodeCreateModuleFactory() {
  return import(
    '../modules/additionally-hierarchies/node-create/node-create.module'
  ).then((m) => m.NodeCreateModule);
}

export function NodeLogicDeviceEditModuleFactory() {
  return import(
    '../modules/additionally-hierarchies/node-logic-devices-edit/node-logic-devices-edit.module'
  ).then((m) => m.NodeLogicDeviceEditModule);
}

export function TypeNodeCardModuleFactory() {
  return import(
    '../modules/additionally-hierarchies/type-node-card/type-node-card.module'
  ).then((m) => m.TypeNodeCardModule);
}

/**
 * REQUEST MODULE
 */
export function RequestCreateModuleFactory() {
  return import(
    '../modules/requests/request-create/request-create.module'
  ).then((m) => m.RequestCreateModule);
}
export function RequestsQueueModuleFactory() {
  return import(
    '../modules/requests/requests-queue/requests-queue.module'
  ).then((m) => m.RequestsQueueModule);
}
export function RequestResultModuleFactory() {
  return import(
    '../modules/requests/request-result/request-result.module'
  ).then((m) => m.RequestResultModule);
}

/**
 * SCHEDULE MODULE
 */
export function SchedulesModuleFactory() {
  return import('../modules/schedule/schedules/schedules.module').then(
    (m) => m.SchedulesModule
  );
}
export function ScheduleCardModuleFactory() {
  return import('../modules/schedule/schedule-card/schedule-card.module').then(
    (m) => m.ScheduleCardModule
  );
}
export function ScheduleStepsModuleFactory() {
  return import(
    '../modules/schedule/schedule-steps/schedule-steps.module'
  ).then((m) => m.ScheduleStepsModule);
}
export function StepRequestsModuleFactory() {
  return import('../modules/schedule/step-requests/step-requests.module').then(
    (m) => m.StepRequestsModule
  );
}
export function StepReportsModuleFactory() {
  return import('../modules/schedule/step-reports/step-reports.module').then(
    (m) => m.StepReportsModule
  );
}
export function StepManageModuleFactory() {
  return import('../modules/schedule/step-manage/step-manage.module').then(
    (m) => m.StepManageModule
  );
}
export function ScheduleResultModuleFactory() {
  return import(
    '../modules/schedule/schedule-result/schedule-result.module'
  ).then((m) => m.ScheduleResultModule);
}
export function ScheduleHierarchiesEditModuleFactory() {
  return import(
    '../modules/schedule/schedule-hierarchies-edit/schedule-hierarchies-edit.module'
  ).then((m) => m.ScheduleHierarchiesEditModule);
}

/**
 * MANAGEMENT MODULE
 */
export function ManagementsModuleFactory() {
  return import('../modules/management/managements/managements.module').then(
    (m) => m.ManagementsModule
  );
}
export function ManagementResultModuleFactory() {
  return import(
    '../modules/management/management-result/management-result.module'
  ).then((m) => m.ManagementResultModule);
}

/**
 * COMMANDS MODULE
 */
export function CommandCreateModuleFactory() {
  return import(
    '../modules/commands/command-create/command-create.module'
  ).then((m) => m.CommandCreateModule);
}

/**
 * CONFIGURATION
 */
export function TypesDevicesModuleFactory() {
  return import(
    '../modules/commands/types-devices-module/types-devices/types-devices.module'
  ).then((m) => m.TypesDevicesModule);
}
export function TypeDeviceCardModuleFactory() {
  return import(
    '../modules/commands/types-devices-module/type-device-card/type-device-card.module'
  ).then((m) => m.TypeDeviceCardModule);
}
export function TypeDeviceCommandModuleFactory() {
  return import(
    '../modules/commands/types-devices-module/type-device-command/type-device-command.module'
  ).then((m) => m.TypeDeviceCommandModule);
}
export function TypeDeviceCommandParameterModuleFactory() {
  return import(
    '../modules/commands/types-devices-module/type-device-command-parameter/type-device-command-parameter.module'
  ).then((m) => m.TypeDeviceCommandParameterModule);
}
export function TypeDeviceCommandParameterOptionModuleFactory() {
  return import(
    '../modules/commands/types-devices-module/type-device-command-parameter-option/type-device-command-parameter-option.module'
  ).then((m) => m.TypeDeviceCommandParameterOptionModule);
}

export function TypesCommandsLogicDevicesModuleFactory() {
  return import(
    '../modules/commands/types-commands-logic-devices-module/types-commands-logic-devices/type-logic-devices.module'
  ).then((m) => m.TypesCommandsLogicDevicesModule);
}
export function TypesCommandsLogicDevicesCardFactory() {
  return import(
    '../modules/commands/types-commands-logic-devices-module/types-commands-logic-devices-card/types-commands-logic-devices-card.module'
  ).then((m) => m.TypesCommandsLogicDevicesCardModule);
}
export function TypesCommandsLogicDevicesParameterFactory() {
  return import(
    '../modules/commands/types-commands-logic-devices-module/types-commands-logic-devices-parameter/types-commands-logic-devices-parameter.module'
  ).then((m) => m.TypesCommandsLogicDevicesParameterModule);
}
export function TypesCommandsLogicDevicesOptionFactory() {
  return import(
    '../modules/commands/types-commands-logic-devices-module/types-commands-logic-devices-option/types-commands-logic-devices-option.module'
  ).then((m) => m.TypesCommandsLogicDevicesOptionModule);
}

export function CommandModuleFactory() {
  return import(
    '../modules/commands/types-commands-devices-module/type-devices/type-devices.module'
  ).then((m) => m.CommandsTypeDevicesModule);
}

export function TagValueBoundsModuleFactory() {
  return import(
    '../modules/commands/tag-value-bounds/tag-value-bounds/tag-value-bounds.module'
  ).then((m) => m.TagValueBoundsModule);
}

export function TagValueBoundsCardModuleFactory() {
  return import(
    '../modules/commands/tag-value-bounds/tag-value-bounds-card/tag-value-bounds.card.module'
  ).then((m) => m.TagValueBoundsCardModule);
}

export function NotificationsModuleFactory() {
  return import(
    '../modules/notifications/notifications/notifications.module'
  ).then((m) => m.NotificationsModule);
}

export function NotificationsCardModuleFactory() {
  return import(
    '../modules/notifications/notifications-card/notifications-card.module'
  ).then((m) => m.NotificationsCardModule);
}

export function NotificationsHierarchiesEditModuleFactory() {
  return import(
    '../modules/notifications/notifications-hierarchies-edit/notifications-hierarchies-edit.module'
  ).then((m) => m.NotificationsHierarchiesEditModuleModule);
}

export function LogicDeviceCommandModuleFactory() {
  return import(
    '../modules/commands/logic-device-command/logic-device-command.module'
  ).then((m) => m.LogicDeviceCommandModule);
}
export function LogicDeviceCommandCreateModuleFactory() {
  return import(
    '../modules/commands/logic-device-command-create/ld-command-create.module'
  ).then((m) => m.LogicDeviceCommandCreateModule);
}
export function CommandsDevicesModuleFactory() {
  return import(
    '../modules/commands/commands-devices/commands-devices.module'
  ).then((m) => m.CommandsDevicesModule);
}
export function DeviceCommandParameterModuleFactory() {
  return import(
    '../modules/commands/device-command-parameter/device-command-parameter.module'
  ).then((m) => m.DeviceCommandParameterModule);
}
export function DeviceCommandParameterCreateModuleFactory() {
  return import(
    '../modules/commands/device-command-parameter-create/device-command-parameter-create.module'
  ).then((m) => m.DeviceCommandParameterCreateModule);
}
export function DeviceCommandParameterOptionCreateModuleFactory() {
  return import(
    '../modules/commands/device-command-parameter-option-create/device-command-parameter-option-create.module'
  ).then((m) => m.DeviceCommandParameterOptionCreateModule);
}
export function DeviceCommandParameterOptionModuleFactory() {
  return import(
    '../modules/commands/device-command-parameter-option/device-command-parameter-option.module'
  ).then((m) => m.DeviceCommandParameterOptionModule);
}

/**
 * REFERENCE MODULE
 */
export function TypesRequestsModuleFactory() {
  return import(
    '../modules/references/types-requests/types-requests.module'
  ).then((m) => m.TypesRequestsModule);
}
export function FilterReferencesModuleFactory() {
  return import(
    '../modules/references/telemechanics/filter-references/filter-references.module'
  ).then((m) => m.FilterReferencesModule);
}
export function DeviceChannelTypesModuleFactory() {
  return import(
    '../modules/references/device-channel-types/device-channel-types.module'
  ).then((m) => m.DeviceChannelTypesModule);
}
export function DevicePropertiesModuleFactory() {
  return import(
    '../modules/references/device-property-types/device-property-types.module'
  ).then((m) => m.DevicePropertyTypesModule);
}
export function LogicDevicePropertyTypesModuleFactory() {
  return import(
    '../modules/references/logic-device-property-types/logic-device-property-types.module'
  ).then((m) => m.LogicDevicePropertyTypesModule);
}
export function TypesLogicDevicesModuleFactory() {
  return import(
    '../modules/references/types-logic-devices/types-logic-devices/types-logic-devices.module'
  ).then((m) => m.TypesLogicDevicesModule);
}
export function TypesLogicDevicesCardModuleFactory() {
  return import(
    '../modules/references/types-logic-devices/types-logic-devices-card/types-logic-devices-card.module'
  ).then((m) => m.TypesLogicDevicesCardModule);
}
export function LogicTagTypesModuleFactory() {
  return import(
    '../modules/references/logic-tag-types/logic-tag-types.module'
  ).then((m) => m.LogicTagTypesModule);
}
export function LogicDeviceKindsCardModuleFactory() {
  return import(
    '../modules/references/logic-device-kinds-card/logic-device-kinds-card.module'
  ).then((m) => m.LogicDeviceKindsCardModule);
}
export function GeographyModuleFactory() {
  return import('../modules/references/geography/geography.module').then(
    (m) => m.GeographyModule
  );
}
export function SubSystemsModuleFactory() {
  return import(
    '../modules/references/sub-systems/sub-systems/sub-systems.module'
  ).then((m) => m.SubSystemsModule);
}
export function AddressBookModuleFactory() {
  return import(
    '../modules/references/address-book-module/address-book.module'
  ).then((m) => m.AddressBookModule);
}

/**
 * IMPORT EXPORT
 */
export function ReferenceImportExportModuleFactory() {
  return import(
    '../modules/import-export/references/import-export-references.module'
  ).then((m) => m.ImportExportReferencesModule);
}

/**
 * JOURNAL SYSTEM EVENTS MODULE
 */
export function JournalSystemEventsMainModuleFactory() {
  return import(
    '../modules/journal-system-events/journal-system-events.module'
  ).then((m) => m.JournalSystemEventsMainModule);
}

/**
 * TARIFF CALCULATION
 */
export function TariffCalculatorMaxPowerModuleFactory() {
    return import('../modules/tariff-calculator/maximum-power/maximum-power.module')
        .then(m => m.MaximumPowerModule)
}

export function TariffCalculatorAgreementTypesModuleFactory() {
    return import('../modules/tariff-calculator/agreement-types/agreement-types.module')
        .then(m => m.AgreementTypesModule)
}

export function TariffCalculatorPowerLevelTypesModuleFactory() {
    return import('../modules/tariff-calculator/power-levels/power-levels.module')
        .then(m => m.PowerLevelsModule)
}

export function TariffCalculatorPriceZonesModuleFactory() {
    return import('../modules/tariff-calculator/price-zones/price-zones/price-zones.module')
        .then(m => m.PriceZoneModule)
}

export function TariffCalculatorPriceZonesCardModuleFactory() {
    return import('../modules/tariff-calculator/price-zones/price-zones-card/price-zones-card.module')
        .then(m => m.PriceZonesCardModule)
}

export function TariffCalculatorPriceZonesPeakCardModuleFactory() {
    return import('../modules/tariff-calculator/price-zones-peak-card/price-zones-peak-card.module')
        .then(m => m.PriceZonesCardPeakModule)
}

export function TariffCalculatorOesModuleFactory() {
    return import('../modules/tariff-calculator/oes/oes/oes.module')
        .then(m => m.OesModule)
}

export function TariffCalculatorOesCardModuleFactory() {
    return import('../modules/tariff-calculator/oes/oes-card/oes-card.module')
        .then(m => m.OesCardModule)
}

export function TariffCalculatorOesDayZoneCardModuleFactory() {
    return import('../modules/tariff-calculator/oes-day-zone-card/oes-day-zone-card.module')
        .then(m => m.OesDayZoneCardPeakModule)
}

export function TariffCalculatorRegionsModuleFactory() {
    return import('../modules/tariff-calculator/regions/regions/regions.module')
        .then(m => m.RegionsModule)
}
export function TariffCalculatorRegionsCardModuleFactory() {
    return import('../modules/tariff-calculator/regions/regions-card/regions-card.module')
        .then(m => m.RegionsCardModule)
}
export function TariffCalculatorTransferCardModuleFactory() {
    return import('../modules/tariff-calculator/tariff-transfer-card/tariff-transfer-card.module')
        .then(m => m.TariffTransferCardModule)
}

export function TariffCalculatorSupplyOrgTypesModuleFactory() {
    return import('../modules/tariff-calculator/supply-org-types/supply-org-types.module')
        .then(m => m.SupplyOrgTypesModule)
    }
export function TariffCalculatorLDTariffHistoryCardModuleFactory() {
    return import('../modules/tariff-calculator/logic-device-tariff-history-card/logic-device-tariff-history-card.module')
        .then(m => m.LogicDeviceTariffHistoryCardModule)
}
export function SuppliersMainModuleFactory() {
  return import(
    '../modules/tariff-calculation/suppliers/suppliers-main/suppliers-main.module'
  ).then((m) => m.SuppliersMainModule);
}
export function SuppliersCardModuleFactory() {
  return import(
    '../modules/tariff-calculation/suppliers/suppliers-card/suppliers-card.module'
  ).then((m) => m.SuppliersCardModule);
}
export function SuppliersAdditionCardModuleFactory() {
  return import(
    '../modules/tariff-calculation/supplier-addition-card/supplier-addition-card.module'
  ).then((m) => m.SupplierAdditionCardModule);
}

export function SuppliersEnergyPriceCardModuleFactory() {
  return import(
    '../modules/tariff-calculation/supplier-energy-price-card/supplier-energy-price-card.module'
  ).then((m) => m.SupplierEnergyPriceCardModule);
}
export function ExportImportQueueModuleFactory() {
    return import(
        '../modules/tariff-calculation/export-import/export-import-queue/export-import-queue.module'
    ).then((m) => m.ExportImportQueueModule);
}
export function ExportImportResultModuleFactory() {
    return import(
        '../modules/tariff-calculation/export-import/export-import-result/export-import-result.module'
    ).then((m) => m.ExportImportResultModule);
}
export function TariffCalculationModuleFactory() {
  return import(
      '../modules/tariff-calculation/tariff-calculation/tariff-calculation.module'
  ).then((m) => m.TariffCalculationModule);
}
export function TariffCalculatorMainQueueModuleFactory() {
  return import(
    '../modules/tariff-calculator/main/queue/main-queue.module'
  ).then((m) => m.MainQueueModule)
}
export function TariffCalculatorMainFilterModuleFactory() {
  return import(
    '../modules/tariff-calculator/main/filters/main-filters.module'
  ).then((m) => m.MainFiltersModule)
}

/**
 * Property Updates
 */
export function PropertyUpdateQueueModuleFactory() {
  return import(
    '../modules/property-update/export-import/export-import-queue/property-update-export-import-queue.module'
  ).then((m) => m.PropertyUpdateExportImportQueueModule)
}
export function PropertyUpdateResultModuleFactory() {
  return import(
    '../modules/property-update/export-import/export-import-result/property-update-export-import-result.module'
  ).then((m) => m.PropertyUpdateExportImportResultModule)
}
export function PropertyUpdateExportImportCreateModuleFactory() {
  return import(
    '../modules/property-update/export-import/export-import-create/property-update-export-import-create.module'
  ).then((m) => m.PropertyUpdateExportImportCreateModule)
}
export function PropertyUpdateExportImportTreeModuleFactory() {
  return import(
    '../modules/property-update/export-import/export-import-properties-tree/properties-tree.module'
  ).then((m) => m.PropertiesTreeModule)
}
export function ExportImportUnitsTreeModuleFactory() {
  return import(
    '../modules/property-update/export-import/export-import-units-tree/export-import-units-tree.module'
  ).then((m) => m.ExportImportUnitsTreeModule)
}


/**
 * Script Editor
 */
export function ScriptEditorModuleFactory() {
  return import('../modules/script-editor/script-editor/script-editor.module')
    .then((m) => m.ScriptEditorModule)
}
export function ScriptEditorCardModuleFactory() {
  return import('../modules/script-editor/script-editor-card/script-editor-card.module')
    .then((m) => m.ScriptEditorCardModule);
}


/**
 * Personal account sub 
 */
export function PaModuleFactory() {
    return import('../modules/sub-personal-account/applications/pa-applications.module')
        .then((m) => m.PaApplicationsModule)
}
export function PaCardModuleFactory() {
    return import('../modules/sub-personal-account/applications-card/pa-applications-card.module')
        .then((m) => m.PaApplicationsCardModule)
}

export function PaSubModuleFactory() {
    return import('../modules/sub-personal-account/subscribers/pa-subscribers.module')
        .then((m) => m.PaSubscribersModule)
}
export function PaSubDocsModuleFactory() {
    return import('../modules/sub-personal-account/sub-documents/pa-sub-documents.module')
        .then((m) => m.PaSubDocumentsModule)
}
export function PaSubDocsCardModuleFactory() {
    return import('../modules/sub-personal-account/sub-documents-card/sub-documents-card.module')
        .then((m) => m.SubDocumentsCardModule)
}
export function PaSubCardModuleFactory() {
    return import('../modules/sub-personal-account/subscribers-card/pa-subscribers-card.module')
        .then((m) => m.PaSubscribersCardModule)
}
export function PaSubHierarchyEditModuleFactory() {
    return import('../modules/sub-personal-account/sub-pa-hierarchy-edit/sub-pa-hierarchy-edit.module')
        .then((m) => m.SubPaHierarchyEditModule)
}
export function PersonalAccountRequestModuleFactory() {
  return import('../modules/sub-personal-account/request/request.module')
    .then((m) => m.PersonalAccountRequestModule)
}
export function PersonalAccountRequestCardModuleFactory() {
  return import('../modules/sub-personal-account/request-card/request-card.module')
    .then((m) => m.PersonalAccountRequestCardModule)
}

export function PersonalAccountAppDocTypesCardModuleFactory() {
  return import('../modules/sub-personal-account/applications-doc-card/applications-doc-card.module')
    .then((m) => m.AppDocTypeCardModule)
}