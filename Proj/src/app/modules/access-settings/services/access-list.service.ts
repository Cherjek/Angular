import { Injectable } from '@angular/core';
import { WebService } from '../../../services/common/Data.service';
import { Observable } from 'rxjs';
import { AccessList } from '../../../services/admin.module/interfaces/access-list';

@Injectable({
  providedIn: 'root'
})
export class AccessListService extends WebService<any> {
  URL = 'admin/groups';

  /**
   * Получение массива модулей с правами доступа
   * @return Observable<IAccessList[]>
   */
  public getModulesAccessList(): Observable<AccessList[]> {
    return super.get('/modules');
  }
}
