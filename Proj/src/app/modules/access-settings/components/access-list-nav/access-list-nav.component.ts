import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AccessList } from '../../../../services/admin.module/interfaces/access-list';

@Component({
  selector: 'rom-access-list-nav',
  templateUrl: './access-list-nav.component.html',
  styleUrls: ['./access-list-nav.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessListNavComponent {
  /** Массив модулей с правами доступа
   * @var accessList IAccessList[]
   */
  @Input() accessList: AccessList[];
  /** Индекс активного таба
   * @var activeAccessListItem number
   */
  @Input() activeAccessListItem: number = 0;
  /** Колбек с индексом активного таба
   * @var toggleActive EventEmitter<number>
   */
  @Output() toggleActive: EventEmitter<number> = new EventEmitter<number>();
}
