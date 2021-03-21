import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'custom-state-filter',
  templateUrl: 'custom-state-filter.component.html',
  styleUrls: ['custom-state-filter.component.less']
})
export class CustomStateFilterComponent {
  @Input() subSystems: any[];
  @Input() stateType: any[];
  @Output() changeFilterState = new EventEmitter<any>();
  rottenItems = [{Id:2,Name:AppLocalization.Relevant},{Id:1,Name:AppLocalization.NotRelevant}];
  acknowledgedItems = [{Id:1,Name:AppLocalization.Kvited},{Id:2,Name:AppLocalization.NotScrolled}];
  filter = {};
  clearAllFilter() {
    this.filter = {};
    ['subSystems', 'stateType', 'rottenItems', 'acknowledgedItems']
      .map(field => {
        ((this[field] || []) as Array<any>).map(x => delete x.IsCheck);
      });

    this.changeFilterState.emit(this.filter);
  }
  checkAllFieldItems(field: string, items: any[]) {
    if (this.filter[field] == null) {
      this.filter[field] = (items || []).map(x => x.Id);
      items.map(x => x.IsCheck = true);
    }
    else if (this.filter[field].length) {
      delete this.filter[field];   
      items.map(x => delete x.IsCheck);       
    }
    this.changeFilterState.emit(this.filter);
  }
  checkFieldItem(field: string, items: any[]) {
    this.filter[field] = [];
    items.forEach(item => {
      if (item.IsCheck) {
        const index = ((this.filter[field] || []) as Array<any>).findIndex(x => x.Id === item.Id);
        if (index >= 0) {
          ((this.filter[field] || []) as Array<any>).splice(index, 1);
        } else {
          this.filter[field].push(item.Id);
        }
      }
    });
    if (!this.filter[field].length) {
      delete this.filter[field];          
    }
    this.changeFilterState.emit(this.filter);
  }
  clearFilter(field: string, items: any[]) {
    if (this.filter[field] != null) delete this.filter[field];
    items.map(x => delete x.IsCheck);
    this.changeFilterState.emit(this.filter);
  }
}