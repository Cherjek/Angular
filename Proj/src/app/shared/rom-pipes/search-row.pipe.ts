import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '../../core';
import * as DataGridComponents from '../../controls/DataGrid';
import DataColumnType = DataGridComponents.DataColumnType;

@Pipe({
  name: 'searchRow'
})
export class SearchRowPipe implements PipeTransform {
  transform(items: any[], filters?: any, columns?: Object | string[], childProperty?: string): any {
    if (filters && typeof (filters) === 'string') {
      return (items || []).filter(
        item => this.searchAllField(childProperty ? item[childProperty] : item, filters, columns));
    }
    return items;
  }

  searchAllField(item: any, filters: string, columns?: Object | string[]): boolean {
    let result: boolean = false;
    let keys: string[] = [];
    if (columns != null) {
      if (columns instanceof Array) {
        keys = columns;
      } else {
        keys = Object.keys(columns);
      }
    } else {
      keys = Object.keys(item);
    }
    for (let key in keys) {
      let itemVal: any = item[keys[key]];
      if (itemVal != null) {
        if (itemVal instanceof Array) {
        } else if (itemVal instanceof Object) {
        } else {
          itemVal = itemVal.toString();
        }
        if (columns) {
          if (columns instanceof Object && columns.hasOwnProperty(keys[key])) {
            //only DataGrid
            if (columns[keys[key]] instanceof DataGridComponents.DataGridColumn) {
              let column = <DataGridComponents.DataGridColumn>columns[keys[key]];
              if (itemVal instanceof Array || itemVal instanceof Object) {
                if (itemVal instanceof Array) itemVal = itemVal[0];
                if (column.AggregateFieldName) {
                  let resAgregate = '';
                  column.AggregateFieldName.forEach((f: string) => resAgregate += itemVal[f] + ' ');
                  itemVal = resAgregate.trim();
                }
              } else {
                if (column.DataType === DataColumnType.Date) {
                  itemVal = Utils.DateFormat.Instance.getDate(itemVal);
                } else if (column.DataType === DataColumnType.DateTime) {
                  itemVal = Utils.DateFormat.Instance.getDateTime(itemVal);
                } else {
                  if (column.AggregateFieldName) {
                    let resAgregate = itemVal;
                    column.AggregateFieldName.forEach((f: string) => {
                      resAgregate += item[f];
                    });
                    itemVal = resAgregate.trim();
                  }
                }
              }
            }
          }
        }
      } else {
        itemVal = '';
      }
      if (filters !== '-0' && filters !== '-0.') {
        let numb = Number(filters);
        if (!isNaN(numb)) {
          if (itemVal != null && itemVal != '') {
            let val = Number(itemVal);
            if (!isNaN(val)) {
              let r = <any>filters == val;
              if (r) { return result || r; }
            }
          }
        }
      }
      if(itemVal instanceof Object) {
        itemVal = JSON.stringify(itemVal);
      }
      result = result || (itemVal || '').toLowerCase().indexOf(filters.toLowerCase()) !== -1;
    }
    return result;
  }
}