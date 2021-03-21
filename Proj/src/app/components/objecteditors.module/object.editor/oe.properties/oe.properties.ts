import {Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute, Router } from "@angular/router";

import { Subscription } from "rxjs/index";

import { ObjectEditorService } from "../../../../services/objecteditors.module/object.editor/ObjectEditor.service";

import { EntityView } from "../../../../services/objecteditors.module/Models/EntityView";
import { EntityViewProperty } from "../../../../services/common/Models/EntityViewProperty";
import { IPropertyEditorService } from "../../../../services/objecteditors.module/Models/IPropertyEditorService";
import { ObjectEditorPropertiesService } from "../../../../services/objecteditors.module/object.editor/ObjectEditorProperties";

import { GlobalValues, PermissionCheck } from "../../../../core";

@Component({
    selector: 'oe-properties',
    templateUrl: './oe.properties.html',
    styleUrls: ['./oe.properties.css'],
    providers: [ObjectEditorPropertiesService]
})
export class OEPropertiesComponent implements OnDestroy {
    private subscription: Subscription;

    public entityId: number;

    public properties: EntityViewProperty[];
    public isPropEdit: boolean = false;

    public errorsPropertyPanel: any[] = [];
    public loadingPropertyPanel: boolean;

    private propertyEditorService: IPropertyEditorService;

    public get isNew() {
        return this.entityId == null;
    }

    constructor(public activatedRoute: ActivatedRoute,
                public objectEditorService: ObjectEditorService,
                public objectEditorPropertiesService: ObjectEditorPropertiesService,
                public router: Router,
                public permissionCheck: PermissionCheck) {

        this.propertyEditorService = objectEditorService;
        this.subscription = this.activatedRoute.parent.params.subscribe(params => {
            let id = params['id'];
            if (Number.isInteger(parseInt(id))) {
                this.entityId = Number(id);
            } else {
                this.isPropEdit = true;
            }

            this.init();
        });
    }

    init() {
        this.loadProperty();
    }

    loadProperty() {
        this.loadingPropertyPanel = true;
        let obsr: any;
        if (this.entityId == null)
            obsr = this.propertyEditorService.getNew();
        else
            obsr = this.propertyEditorService.getEntity(this.entityId);

        obsr.subscribe((data: EntityView) => {
                this.loadingPropertyPanel = false;
                this.properties = data.Properties;
            },
            (error: any) => {
                this.errorsPropertyPanel = [error];
                this.loadingPropertyPanel = false;
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    saveObject(properties: EntityViewProperty[]) {

        this.loadingPropertyPanel = true;

        let id: any = this.entityId;
        let entity = {
            Id: id,
            Properties: properties
        }

        let obsr: any;
        let callback: any;
        if (this.entityId == null) {
            obsr = this.propertyEditorService.setNew(<EntityView>entity);
            callback = (idEntity: number) => {
                this.goToEditPage(idEntity);
            }
        } else {
            obsr = this.propertyEditorService.update(<EntityView>entity);
            callback = (idEntity: number) => {
                this.loadProperty();
            }
        }

        obsr.then((idEntity: number) => {
                this.isPropEdit =
                    this.loadingPropertyPanel = false;
                callback(idEntity);
        })
            .catch((error: any) => {
                this.loadingPropertyPanel = false;
                this.errorsPropertyPanel = [error];
            });
    }

    back2Objects() {
        GlobalValues.Instance.Page.backwardButton.navigate();
    }

    goToEditPage(idEntity: number) {

        this.permissionCheck.addUnitToPermissions(idEntity)
            .subscribe(() => {
                this.router.navigate([`/object-editor/${idEntity}/properties`]);
            });
        
    }

    changeProperties() {
        this.isPropEdit = true;
    }

    rollbackPropertyChanges(propertyEditor: any) {
        propertyEditor.rollbackProperty();
        this.isPropEdit = false;
    }
}
