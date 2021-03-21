import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataGridCurrentItemService {
  /**
   * current selected data grid item
   * @var item any
   */
  private item: any;
  /**
   * current selected data grid item unique key for index search
   * @var uniqueKey string
   */
  private uniqueKey: string;

  public setCurrentItem(item: any, uniqueKey: string = 'Id'): void {
    this.item = item;
    this.uniqueKey = uniqueKey;
  }

  public getCurrentItem(): any {
    return this.item;
  }

  public clearCurrentItem(): void {
    this.item = null;
    this.uniqueKey = 'Id';
  }

  public getUniqueKey(): string {
    return this.uniqueKey;
  }
}
