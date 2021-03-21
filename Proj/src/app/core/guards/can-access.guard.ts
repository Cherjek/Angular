import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { AccessDirectiveConfig, PermissionCheck } from '../index';
import { map, tap } from 'rxjs/operators';

// для объектов, оборудования, устройств, при создании - id = new, при этих permission, выдавать true
//const accessNewUnit = ['OC_VIEW_OBJECT_CARD', 'OC_VIEW_OBJECT_PROPERTIES'];
//const accessNewLogicDevice = ['OC_VIEW_EQUIPMENT_CARD', 'OC_VIEW_EQUIPMENT_PROPERTIES'];
//const accessNewDevice = ['OC_VIEW_DEVICE_CARD', 'OC_VIEW_DEVICE_PROPERTIES'];
//тут что-то написано

@Injectable({
    providedIn: 'root'
})
export class CanAccessGuard implements CanActivate {

    constructor(public permissionCheck: PermissionCheck, public router: Router, public route: ActivatedRoute) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        const id = next.data.queryParam ?
            state.root.queryParams[next.data.queryParam] :
            state.root.firstChild.params.id;

        //if (id === 'new') return true;

        if (Array.isArray(next.data.access)) {
            let checkAuthArr: any[] = [];
            next.data.access.forEach((el) => {

                if (el instanceof AccessDirectiveConfig) {
                    el['keySource'] = id;
                }

                let access = el;

                let result = this.checkCreateEntity(id, state.url, state.root.queryParams);
                if (result != null) {
                    access = result;
                }

                checkAuthArr.push(this.permissionCheck.checkAuthorization(access));
            });
            return forkJoin(checkAuthArr).pipe(
                map((response) => {
                    return !response.includes(false);
                }),
                tap((hasAccess) => {
                    if (!hasAccess) {
                        this.redirect(next);
                    }
                }),
            );
        } else {
            if (next.data.access instanceof AccessDirectiveConfig) {
                next.data.access['keySource'] = id;
            }

            let access = next.data.access;

            let result = this.checkCreateEntity(id, state.url, state.root.queryParams);
            if (result != null) {
                access = result;
            }

            return this.permissionCheck.checkAuthorization(access).pipe(
                tap(hasAccess => {
                    if (!hasAccess) {
                        this.redirect(next);
                    }
                })
            );
        }
    }

    //Todo костыль для создания объектов, оборудования, устройств, т.к. они зависят от других правил
    private checkCreateEntity(id: any, url: string, queryParams: any): any {

        if (id === 'new') {
            if (url.startsWith('/object-editor/new')) {

                return 'OE_CREATE_OBJECT';

            } else if (url.startsWith('/ld-editor/new')) {

                return Object.assign(new AccessDirectiveConfig(), { keySource: queryParams['unitId'], source: 'Units', value: 'OE_CREATE_EQUIPMENT' });
            }
            else if (url.startsWith('/device-editor/new')) {

                return Object.assign(new AccessDirectiveConfig(), { keySource: queryParams['unitId'], source: 'Units', value: 'OE_CREATE_DEVICE' });
            }
        }

        return null;
    }

    private redirect(next: ActivatedRouteSnapshot) {
        if (next.data.noAccessNavigateTo) {
            
            let urls = next.parent.url;
            if (!urls.length) {
                if (next.parent.parent != null) {
                    urls = next.parent.parent.url;
                }
            }
            
            const url = urls.map(u => u.path).join('/');

            this.router.navigate([`${url}/${next.data.noAccessNavigateTo}`]);
        } else {
            this.router.navigate(['not-found-page'], { queryParams: { access: false } });
        }
    }
}
