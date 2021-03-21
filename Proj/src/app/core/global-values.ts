/*
 * Класс используется как сервис для взаимосвязи между компонентами на разных уровнях 
 * 
 * 
 * 
 */

import { Injectable } from '@angular/core';
import { Navigate } from '../common/models/Navigate/Navigate';
import { UrlHistory } from '../common/UrlHistory/UrlHistory';
import { UserApp } from '../services/common/Models/User';
import { IHierarchy } from '../services/additionally-hierarchies';
import { Common } from '../common/Constants';
import Constants = Common.Constants;

@Injectable()
export class GlobalValues {

    private static _instance: GlobalValues;
    public static get Instance(): GlobalValues {
        if (!this._instance) this._instance = new GlobalValues();
        return this._instance;
    }

    Navigate: Navigate;//данные по выбранному пункту меню в компоненте Navigate.ts

    _page: any;//любая информация с любым JSON объектом, для взаимодействия между компонентами <router-outlet>
    get Page(): any {
        if (this._page == null) this._page = {};

        return this._page;
    }
    set Page(pageVal: any) {
        if (this._page == null) this._page = {};

        Object.assign(this._page, pageVal);
    }

    UrlHistory: UrlHistory = new UrlHistory();

    //user
    private __userApp: UserApp;
    get userApp(): UserApp {

        if (!this.__userApp) {
            const storage = localStorage.getItem(Constants.STORAGE_USER_APP_KEY);
            if (storage != null) {
                this.__userApp = Object.assign(new UserApp(), JSON.parse(storage));
            }
        }

        return this.__userApp;
    }
    set userApp(userApp: UserApp) {
        if (userApp != null) {
            localStorage.setItem(Constants.STORAGE_USER_APP_KEY, JSON.stringify(userApp));
        } else {
            localStorage.removeItem(Constants.STORAGE_USER_APP_KEY);
        }

        this.__userApp = userApp;
    }

    private _hierarchySelect: IHierarchy;
    get hierarchyApp() {
        const hierarchy = sessionStorage.getItem(Constants.HIERARCHY_SESSION_KEY);
        if (hierarchy != null) {
            if (this._hierarchySelect == null) {
                this._hierarchySelect = JSON.parse(hierarchy);
            }
        }

        return this._hierarchySelect || {} as IHierarchy;
    }
    set hierarchyApp(val: IHierarchy) {
        sessionStorage.setItem(Constants.HIERARCHY_SESSION_KEY, JSON.stringify(val));
        this._hierarchySelect = val;
    }
}