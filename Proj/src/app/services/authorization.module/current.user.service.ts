import { Injectable } from '@angular/core';
import { forkJoin, Observable, ReplaySubject } from 'rxjs';
import { User } from './Models/User';
import { WebService } from '../common/Data.service';

@Injectable({
    providedIn: 'root'
})
export class CurrentUserService extends WebService<any> {
    readonly URL: string = 'permissions';
    private userSubject = new ReplaySubject<User>(1);
    private user: User;

    public dropUser(): void {
        this.user = null;
        this.userSubject = new ReplaySubject<User>(1);
    }

    public getUser(): Observable<User> {
        if (!this.user) {
            this.fetchUser();
        }
        return this.userSubject.asObservable();
    }

    private fetchUser(): void {

        this.user = new User();
        forkJoin(this.get('active'), this.get('units'), this.get('logicDevices'), this.get('hierarchies'))
            .subscribe((response) => {
                // получение всех common разрешений
                this.user.permissions = new Set<string>(response[0]);
                // получение разрешений для объектов
                this.user.permissionUnit = new Map<string, Set<number>>();
                Object.keys(response[1]).forEach(key => {
                    this.user.permissionUnit.set(key, new Set<number>(response[1][key]));
                });
                // получение разрешений для оборудования
                this.user.permissionLogicDevices = new Map<string, Set<number>>();
                Object.keys(response[2]).forEach(key => {
                    this.user.permissionLogicDevices.set(key, new Set<number>(response[2][key]));
                });
                // получение разрешений для иерархий
                this.user.permissionHierarchies = new Map<string, Set<number>>();
                Object.keys(response[3]).forEach(key => {
                    this.user.permissionHierarchies.set(key, new Set<number>(response[3][key]));
                });
                this.userSubject.next(this.user);
                this.userSubject.complete();
            },
            (error) => {
                console.error('User service error: ', error);
                this.user = null;
                this.userSubject.error(error);
            }
        );
    }

    /**
     * получаем список доступных отчетов
     * @param guid, ключ, который используется для сохранения списка оборудования, при переходе с главного окна в модуль анализ(создание анализа), отчеты(создание отчета), представление данных(создание представления)
     * возвращает список idReport, которые доступны
     */
    public getPermissionReports(guid: string): Observable<number[]> {
        return this.get(`reports?key=${guid}`);
    }

    /**
     * получение разрешений для списка оборудования
     * @param ids
     * возвращает массив разрешений - [
            'DA_START',
            'DR_START'
        ]
     */
    public checkPermissionLogicDeviceIds(ids: number[]): Promise<any> {
        return this.post(ids, `logicDevicesCheck`);
    }

    //получение всех прав для объекта
    public getUnitPermissions(unitId: number): Observable<string[]> {
        return this.get(`units/${unitId}/active`);
    }

    //получение всех прав для оборудования
    public getLogicDevicePermissions(logicDeviceId: number): Observable<string[]> {
        return this.get(`logicDevices/${logicDeviceId}/active`);
    }
}
