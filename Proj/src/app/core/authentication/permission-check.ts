import { AppLocalization } from 'src/app/common/LocaleRes';
import { Injectable } from '@angular/core';
import { Observable, Observer, forkJoin } from 'rxjs';
import { of } from 'rxjs';
import { map, tap, finalize } from 'rxjs/operators';
import { CurrentUserService } from '../../services/authorization.module/current.user.service';
import { User } from '../../services/authorization.module/Models/User';
import { RomLoaderService } from '../../shared/rom-loader/services/rom-loader.service';
import { GlobalValues } from '../../core';

@Injectable({
    providedIn: 'root'
})
export class PermissionCheck {
    user: User;
    private accessDirectiveConfig: AccessDirectiveConfig;

    // do your remember the step 1 ? it is used here
    constructor(
        private loaderService: RomLoaderService,
        private currentUserService: CurrentUserService) {
    }

    public dropUser(): void {
        this.user = null;
        
        this.currentUserService.dropUser();
    }

    public updateAccessUser(): Observable<User> {
        return this.currentUserService.getUser();
    }

    public addUnitToPermissions(unitId: number): Observable<boolean> {

        return new Observable<boolean>(subscribe => {

            this.currentUserService.getUnitPermissions(unitId)
                .subscribe((permissions: string[]) => {

                    permissions.forEach((permission: string) => {
                        if (!this.user.permissionUnit.has(permission)) {
                            this.user.permissionUnit.set(permission, new Set<number>());
                        }
                        const permissionUnit = this.user.permissionUnit.get(permission);
                        permissionUnit.add(unitId);
                    });

                    subscribe.next(true);
                    subscribe.complete();

                });

        });
        
    }

    public addLogicDeviceToPermission(logicDeviceId: number): Observable<boolean> {

        return new Observable<boolean>(subscribe => {

            this.currentUserService.getLogicDevicePermissions(logicDeviceId)
                .subscribe((permissions: string[]) => {

                    permissions.forEach((permission: string) => {
                        if (!this.user.permissionLogicDevices.has(permission)) {
                            this.user.permissionLogicDevices.set(permission, new Set<number>());
                        }
                        const permissionLogicDevices = this.user.permissionLogicDevices.get(permission);
                        permissionLogicDevices.add(logicDeviceId);
                    });

                    subscribe.next(true);
                    subscribe.complete();

                });

        });
        
    }

    // returns a boolean observable
    public checkAuthorization(path: string | string[] | AccessDirectiveConfig): Observable<boolean> {
        // we are loading the roles only once
        if (path == null) return of(true);

        if (!this.user) {

            this.loaderService.showLoader(AppLocalization.Label59);

            return this.currentUserService.getUser()
                .pipe(
                    finalize(() => {

                        this.loaderService.hideLoader();

                    }),
                    map(user => user),
                    tap(user => {
                        this.user = user;
                    }),
                    map(user => this.getAccess(path))
                );
        }
        return of(this.getAccess(path));
    }

    private getAccess(path: string | string[] | AccessDirectiveConfig): boolean {
        this.accessDirectiveConfig = new AccessDirectiveConfig();
        if (path instanceof AccessDirectiveConfig) {
            if (path.keySource != null) {
                if (typeof path.keySource === 'string') {
                    path.keySource = Number(path.keySource);
                }
            }
            if (path.source != null) {
                if (typeof path.source === 'string') {
                    path.convertSource(path.source);
                }
            }
            if (path.operator != null) {
                if (typeof path.operator === 'string') {
                    path.convertOperator(path.operator);
                }
            }
            if (path.arrayOperator != null) {
                if (typeof path.arrayOperator === 'string') {
                    path.convertArrayOperator(path.arrayOperator);
                }
            }

            this.accessDirectiveConfig = path;

            if (this.accessDirectiveConfig.source === Source.Units ||
                this.accessDirectiveConfig.source === Source.LogicDevices ||
                this.accessDirectiveConfig.source === Source.Hierarchies) {
                
                return this.doCheckAuthorization(path);
            } else {
                return this.doCheckCommonAuthorization(path.value);
            }

        } else {
            return this.doCheckCommonAuthorization(path);
        }
    }

    //метод делает проверку для permissionUnit and permissionLogicDevices,
    //один из вариантов проверки прав, по объекту или оборудованию
    private doCheckAuthorization(access: AccessDirectiveConfig): boolean {
        
        let dataSource: Map<string, Set<number>>;
        if (access.source === Source.Units) {
            dataSource = this.user.permissionUnit;
        } else if (access.source === Source.LogicDevices) {
            dataSource = this.user.permissionLogicDevices;
        } else {
            dataSource = this.user.permissionHierarchies;
        }

        const ids = dataSource.get(<string>access.value);

        if (ids) {
            if (access.keySource) {
                return ids.has(access.keySource);
            }
        }
        
        return false;
    }

    //проверка по permissions, общие права
    private doCheckCommonAuthorization(path: string | string[]): boolean {

        if (this.isSuperUserAdmAccess(path)) {
            return true;
        }

        if (path.length) {
            let result = false;
            if (typeof path === 'string') {
                result = this.user.permissions.has(path);
            } else if (path instanceof Array) {
                if (this.accessDirectiveConfig.arrayOperator === ArrayOperator.And) {
                    // чтобы все значения path были true
                    result = path.every((p: string) => {
                        return this.user.permissions.has(p);
                    });
                } else if (this.accessDirectiveConfig.arrayOperator === ArrayOperator.Or) {
                    // чтобы хотя бы одно значение path было true
                    result = path.some((p: string) => {
                        return this.user.permissions.has(p);
                    });
                }
            }
            if (this.accessDirectiveConfig.operator === Operator.Equal) {
                return result;
            } else if (this.accessDirectiveConfig.operator === Operator.NotEqual) {
                return !result;
            }
            return false;
        }
        return false;
    }

    //если супер пользователь, не проверять права в админке - ADM_
    private isSuperUserAdmAccess(access: string | string[]) {
        let result: boolean;
        if (access instanceof Array) {
            result = access.every(a => { return a.startsWith('ADM_') });
        } else {
            result = access.startsWith('ADM_');
        }
        return result && GlobalValues.Instance.userApp.IsSuperUser;
    }
}

@Injectable({
  providedIn: 'root'
})
export class PermissionCheckUtils {
  constructor(private permissionCheck: PermissionCheck) {
  }
  public getAccess<T>(permissions: string[] | AccessDirectiveConfig[], values: T[]) {
    return new Observable<T[]>(subscribe => {
      const obsrvs: any[] = [];
      permissions.forEach((access: string | AccessDirectiveConfig) => {
          obsrvs.push(this.permissionCheck.checkAuthorization(access));
      });
      forkJoin<boolean>(obsrvs)
        .subscribe(result => {
          result.forEach((r, i) => {
            if (!r) {
              values[i] = null;
            }
          });

          const vals = values.filter(v => v !== null);
          subscribe.next(vals);
          subscribe.complete();
        });
    });
  }
}

enum Operator {
    Equal, // передаваемый access присутсвует в доступе
    NotEqual // передаваемый access отсутсвует в доступе
}

enum ArrayOperator {
    And,
    Or
}

//место, в котором осуществляем поиск записи
//доступы бывают трех видов: общий, для объектов, и для логических устройств(оборудования)
//они находятся в классе User
enum Source {
    Common,
    Units,
    LogicDevices,
    Hierarchies
}

/*
 * НАСТРАИВАЕМЫЙ ACCESS
 * нужен для настройки поиска в WorkflowEvents.doCheckAuthorization
 */
export class AccessDirectiveConfig {
    //ключ, по которому ищем значение в User: permissionUnit or permissionLogicDevices
    keySource?: number;
    //указывает источник, в котором ищем значение у User: permissionUnit or permissionLogicDevices
    source: string | Source = Source.Common;
    operator: string | Operator = Operator.Equal; // условие поиска
    arrayOperator: string | ArrayOperator = ArrayOperator.And; // при поиске в массиве, если and - оператор every, если or - some
    value: string | string[];

    convertSource(s: string): void {
        if (s === Source[Source.Hierarchies]) {
            this.source = Source.Hierarchies;
        } else if (s === Source[Source.Units]) {
            this.source = Source.Units;
        } else if (s === Source[Source.LogicDevices]) {
            this.source = Source.LogicDevices;
        } else {
            this.source = Source.Common;
        }
    }

    convertOperator(o: string): void {
        if (o === Operator[Operator.Equal]) {
            this.operator = Operator.Equal;
        } else if (o === Operator[Operator.NotEqual]) {
            this.operator = Operator.NotEqual;
        }
    }

    convertArrayOperator(ao: string): void {
        if (ao === ArrayOperator[ArrayOperator.And]) {
            this.arrayOperator = ArrayOperator.And;
        } else if (ao === ArrayOperator[ArrayOperator.Or]) {
            this.arrayOperator = ArrayOperator.Or;
        }
    }
}
