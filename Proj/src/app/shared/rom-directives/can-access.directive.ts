/* ДОСТУП К DOM, ограничивает просмотр элементов
 * согласно загруженным для пользователя permissions
 *
 * default example:
 * *appCanAccess="'DA_USE_FAVORITES'"
 * *appCanAccess="['DA_USE_FAVORITES','DR_ALLOW','DR_START']"
 *
 * custom example:
 * *appCanAccess="{ operator: 'NotEqual', value: 'DA_USE_FAVORITES' }"
 * *appCanAccess="{ operator: 'Equal', value: 'DA_USE_FAVORITES' }"
 * *appCanAccess="{ operator: 'Equal', arrayOperator: 'Or', value: ['DA_START','DA_USE_FAVORITES'] }"
 *
 * units/logic devices example:
 * *appCanAccess="{ keySource: item.key, source: 'Units', value: 'DA_START' }"
 * *appCanAccess="{ keySource: item.key, source: 'LogicDevices', value: 'DA_START' }"
 *
 * example else:
 * *appCanAccess="'OC_VIEW_OBJECT_CARD'; else disabledUnitLink", где disabledUnitLink - какой-то TemplateRef на форме
 */

import { Input, Directive, ViewContainerRef, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { PermissionCheck, AccessDirectiveConfig } from '../../core';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[appCanAccess]'
})
export class CanAccessDirective implements OnInit, OnDestroy {
    private _appCanAccess: string | string[] | AccessDirectiveConfig;
    @Input('appCanAccess') set appCanAccess(value: string | string[] | AccessDirectiveConfig) {
        if (this.isObject(value)) {
            const accessConfig = new AccessDirectiveConfig();
            if (value['keySource'] !== null) {
                accessConfig.keySource = value['keySource'];
            }
            if (value['source'] !== null) {
                accessConfig.convertSource(value['source']);
            }
            if (value['operator'] !== null) {
                accessConfig.convertOperator(value['operator']);
            }
            if (value['arrayOperator'] !== null) {
                accessConfig.convertArrayOperator(value['arrayOperator']);
            }
            if (value['value'] !== null) {
                accessConfig.value = value['value'];
            }
            this._appCanAccess = accessConfig;
        } else {
            this._appCanAccess = value;
        }
    }
    get appCanAccess(): string | string[] | AccessDirectiveConfig {
        return this._appCanAccess;
    }
    @Input('appCanAccessElse') elseTemplate: TemplateRef<any>;
    private permission$: Subscription;

    constructor(private templateRef: TemplateRef<any>,
                private viewContainer: ViewContainerRef,
                private permissionCheck: PermissionCheck) {
    }

    ngOnInit(): void {
        if (this.appCanAccess !== undefined) {
            this.applyPermission();
        } else {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
    }

    private isObject(value: any): boolean {
        return (!(value instanceof AccessDirectiveConfig) && !(value instanceof Array) && typeof value === 'object');
    }

    private applyPermission(): void {
        this.permission$ = this.permissionCheck.checkAuthorization(this.appCanAccess).subscribe(
            (authorized) => {
                if (authorized) {
                    this.viewContainer.createEmbeddedView(this.templateRef);
                } else {
                    if (this.elseTemplate != null) {
                        this.viewContainer.createEmbeddedView(this.elseTemplate);
                    } else {
                        this.viewContainer.clear();
                    }
                }
            });
    }

    ngOnDestroy(): void {
        if (this.permission$) {
            this.permission$.unsubscribe();
        }
    }
}
