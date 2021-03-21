import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AccessList, AccessListPermission } from '../../../../services/admin.module/interfaces/access-list';

@Component({
  selector: 'rom-access-list-info',
  templateUrl: './access-list-info.component.html',
  styleUrls: ['./access-list-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessListInfoComponent {
  /** Массив модулей с правами доступа
   * @var accessList IAccessList[]
   */
  @Input() accessList: AccessList[];
  /** Индекс активного таба
   * @var activeAccessListItem number
   */
    @Input() activeAccessListItem: number = 0;

    public saveItem(item: AccessListPermission) {
        localStorage.setItem('AccessListInfoComponent.item.save', JSON.stringify(item));
    }
}
