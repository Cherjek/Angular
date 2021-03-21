import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from "../../shared/shared.module";
import { ControlsModule } from '../../controls/ct.module';

//Object form
import { ObjectEditorComponent } from './object.editor/object.editor';

import { OELogicDevicesComponent } from './object.editor/oe.logicdevices/oe.logicdevices';
import { LDDevicesComponent } from "./object.editor/oe.logicdevices/ld.devices/ld.devices";

import { OEDevicesComponent } from './object.editor/oe.devices/oe.devices';
import { DLogicDevicesComponent } from "./object.editor/oe.devices/d.logicdevices/d.logicdevices";

import { OEPropertiesComponent } from './object.editor/oe.properties/oe.properties';
import { OECurrentDataComponent } from "./object.editor/oe.currentdata/oe.currentdata";

import { LDCurrentDataComponent } from "./object.editor/oe.logicdevices/ld.currentdata/ld.currentdata";

//Logic devices form
import { LogicDeviceEditorComponent } from './logicdevice.editor/logicdevice.editor';
import { LDECurrentDataComponent } from './logicdevice.editor/lde.currentdata/lde.currentdata';
import { LDEPropertiesComponent } from './logicdevice.editor/lde.properties/lde.properties';
import { LDETagsComponent } from './logicdevice.editor/lde.tags/lde.tags';
import { LogicDeviceTypesComponent } from "./logicdevice.editor/logicdevice.types/logicdevice.types";
import { LDETagsEditorComponent } from "./logicdevice.editor/lde.tagsEditor/lde.tagsEditor";
import { CommandsComponent } from "./logicdevice.editor/commands/commands.component";
import { TagsSortingComponent } from "./tags.sorting/tags.sorting";
import { TagsCardComponent } from './logicdevice.editor/tags-card/tags-card.component';

import { ConnectionLDDevicesComponent } from "./connection.ld.devices/connection.ld.devices";

//Devices form
import { DeviceEditorComponent } from "./device.editor/device.editor";
import { DEPropertiesComponent } from "./device.editor/de.properties/de.properties";
import { DeviceTypesComponent } from "./device.editor/device.types/device.types";

//Tags form
import { TagsEditorComponent } from "./tags.editor/tags.editor";

//Services

import { ObjectEditorService } from "../../services/objecteditors.module/object.editor/ObjectEditor.service";
import { LogicDeviceEditorService } from "../../services/objecteditors.module/logicDevice.editor/LogicDeviceEditor.service";
import { DeviceEditorService } from "../../services/objecteditors.module/device.editor/DeviceEditor.service";

import { OELDFilterContainerService } from '../../services/objecteditors.module/object.editor/oe.logicdevices/Filters/OELDFilterContainer.service';
import { OELDAllFiltersService } from '../../services/objecteditors.module/object.editor/oe.logicdevices/Filters/OELDAllFilters.service';
import { OELDFiltersService } from '../../services/objecteditors.module/object.editor/oe.logicdevices/Filters/OELDFilters.service';
import { OELogicDevicesService } from "../../services/objecteditors.module/object.editor/oe.logicdevices/OELogicDevices.service";
import { OELDStatusesService } from "../../services/objecteditors.module/object.editor/oe.logicdevices/OE.LD.Statuses.services";
import { RelatedDevicesService } from "../../services/objecteditors.module/object.editor/oe.logicdevices/RelatedDevices.service";
import { RelatedLogicDevicesService } from "../../services/objecteditors.module/object.editor/oe.devices/RelatedLogicDevices.services";


import { OEDFilterContainerService } from '../../services/objecteditors.module/object.editor/oe.devices/Filters/OEDFilterContainer.service';
import { OEDAllFiltersService } from '../../services/objecteditors.module/object.editor/oe.devices/Filters/OEDAllFilters.service';
import { OEDFiltersService } from '../../services/objecteditors.module/object.editor/oe.devices/Filters/OEDFilters.service';
import { OEDevicesService } from "../../services/objecteditors.module/object.editor/oe.devices/OEDevices.services";


import { EquipmentService } from "../../services/common/Equipment.service";
import { PropertiesService } from "../../services/common/Properties.service";

import { LogicDeviceTypesService } from "../../services/objecteditors.module/logicDevice.editor/LogicDeviceTypes.service";
import { ConnectionLDDevicesService } from "../../services/objecteditors.module/connection.ld.devices/ConnectionLDDevices.service";
import { LogicDeviceEditorTagsService } from "../../services/objecteditors.module/logicDevice.editor/lde.tags/LogicDeviceEditorTags";

import { DeviceTypesService } from "../../services/objecteditors.module/device.editor/device.types/device.types.service";

import { LDETagsAllFiltersService } from "../../services/objecteditors.module/logicDevice.editor/lde.tags/Filters/LDETagsAllFilters.service";
import { LDETagsFiltersService } from "../../services/objecteditors.module/logicDevice.editor/lde.tags/Filters/LDETagsFilters.service";
import { LDETagsFilterContainerService } from "../../services/objecteditors.module/logicDevice.editor/lde.tags/Filters/LDETagsFilterContainer.service";
import { DETypesRequestComponent } from './device.editor/de.types-request/de.types-request.component';
import {SharedModule as SharedModule2} from 'src/app/modules/requests/shared/shared.module';
import { TagValueBoundsService } from 'src/app/services/commands/Configuration/tag-value-bounds.service';
import { LDETariffComponent } from './logicdevice.editor/lde.tariff/lde.tariff.component';
import { HierarchyCardFilesModule } from 'src/app/modules/additionally-hierarchies/hierarchy-card/hierarchy-card-files.module';
import { TagsParamsComponent } from './logicdevice.editor/tags-params/tags-params.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule,

        SharedModule,
        ControlsModule,
        SharedModule2,

        HierarchyCardFilesModule
    ],
    exports: [],
    entryComponents: [
        DLogicDevicesComponent,
        LDDevicesComponent,
        OECurrentDataComponent,
        LDCurrentDataComponent
    ],
    providers: [
        ObjectEditorService,
        LogicDeviceEditorService,
        DeviceEditorService,

        OELogicDevicesService,
        OELDStatusesService,

        OEDevicesService,

        OELDFilterContainerService,
        OELDAllFiltersService,
        OELDFiltersService,

        OEDFilterContainerService,
        OEDAllFiltersService,
        OEDFiltersService,
        
        EquipmentService,

        RelatedDevicesService,
        RelatedLogicDevicesService,

        PropertiesService,

        LogicDeviceTypesService,
        ConnectionLDDevicesService,
        LogicDeviceEditorTagsService,

        DeviceTypesService,

        LDETagsAllFiltersService,
        LDETagsFiltersService,
        LDETagsFilterContainerService,

        TagValueBoundsService
    ],
    declarations: [
        LogicDeviceEditorComponent,

        LDECurrentDataComponent,
        LDEPropertiesComponent,
        LDETagsComponent,
        LDETagsEditorComponent,
        LDETariffComponent,

        ObjectEditorComponent,

        OEDevicesComponent,
        DLogicDevicesComponent,

        OELogicDevicesComponent,
        OEPropertiesComponent,

        DLogicDevicesComponent,
        LDDevicesComponent,
        LDCurrentDataComponent,
        OECurrentDataComponent,

        LogicDeviceTypesComponent,
        TagsSortingComponent,
        ConnectionLDDevicesComponent,

        DeviceEditorComponent,
        DEPropertiesComponent,
        DETypesRequestComponent,
        DeviceTypesComponent,

        TagsEditorComponent,
        CommandsComponent,
        TagsCardComponent,
        TagsParamsComponent
    ]
})
export class ObjectEditorModule { }
