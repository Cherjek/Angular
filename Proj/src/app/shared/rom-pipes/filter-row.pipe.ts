import { Pipe, PipeTransform } from '@angular/core';
import * as CommonModules from '../../common/models/Filter/DateRange';
import { FilterValue, FilterOperationType } from '../../common/models/Filter/FilterValue';

/*
 * Пр-р:
 * 
 * filters?: Object - объект фильтр: { Field1: 'weefw', Field2: 10, Field3: CommonModules.Common.Models.Filter.DateRange, Field4: FilterValue }
 * 
 * FilterValue и DateRange находятся в common/models/Filter, специализированные типы фильтра, с установленными значениями
 * остальные типы воспринимаются как простые
 * 
 * FilterValue тип, который содержит условие фильтра: <, <=, >, >=, =, !=, contains
 */
@Pipe({
  name: 'filterRow'
})
export class FilterRowPipe implements PipeTransform {
  transform(items: any[], field?: any, filters?: string | Object, operator: string = '||'): any {
    if (filters != null) {
      if (typeof (filters) === 'string') {
        if (field == null) {
          throw 'field param is null';
        }
        return items.filter(
          item => this.getObjectValue(item, field).toLowerCase().indexOf((filters || '').toLowerCase()) !== -1);
      } else {
        Object.keys(filters).forEach(field => items = this.getItemRows(field, filters[field], items, operator));
        return items;
      }
    } else {
      return items;
    }
  }

  private fieldParse(field: string) {
    let codes = field.split('|');
    let code: string = '';
    codes.forEach((c: string) => code += `["${c}"]`);
    return code;
  }

  private getObjectValue(item: any, field?: any): string {
    let value: string = '';
    if (field) {
      field = this.fieldParse(field);
      value = eval(`item${field}`);
    }
    return value || '';
  }

  /**
   * 
   * @param field, field может прнимать несколько полей для вложенности объектов, н-р: field = "['UnitStatus']['Color']"
   * @param filterValues
   * @param items
   */
  private getItemRows(field: any, filterValue: any | any[], items: any[], operator: string) {
    field = this.fieldParse(field);
    let filter: string = '';
    if (filterValue instanceof Array) {
      filterValue.forEach(
        (value: any, index: number) => {
          let __value;
          if (!(value instanceof FilterValue)) {
            __value = new FilterValue(value, FilterOperationType.Equal);
          } else
            __value = value;
          filter += this.getFilterArray2(field, __value) + (index < filterValue.length - 1 ? ` ${operator} ` : '');
        }
      );
    } else {
      filter = this.getFilterArray2(field, filterValue);
    }
    return filter !== '' ? items.filter(item => eval(`item${field} != null && ` + filter)) : items;
  }
  private getResultText(field: string, value: any, operator?: string) {
    if (operator) {
      if (typeof value === 'string') {
        value = `'${value}'`;
      }
      return `(item${field} ${operator} ${value})`;
    } else {
      return `(item${field}.toLowerCase().indexOf('${value}'.toLowerCase()) !== -1)`;
    }
  }

  private getFilterArray2(field: any, value: any) {
    let result = '';
    if (typeof (value) === 'string' || typeof (value) === 'number' || value instanceof FilterValue) {
      //field может прнимать несколько полей для вложенности объектов, н-р: field = "['UnitStatus']['Color']"
      let operator: string;
      let val: any;
      if (value instanceof FilterValue) {
        operator = value.OperationOperator;
        val = value.Value;
      } else {
        val = value;
      }
      result = this.getResultText(field, val, operator);
    } else if (typeof (value) === 'object') {
      if (value instanceof CommonModules.Common.Models.Filter.DateRange) {
        if (value.FromDate && value.ToDate) {
          result = `new Date(item${field}) >= new Date('${value.FromDate}') && new Date(item${field}) <= new Date('${value.ToDate}')`;
        } else if (value.FromDate) {
          result = `new Date(item${field}) >= new Date('${value.FromDate}')`;
        } else if (value.ToDate) {
          result = `new Date(item${field}) <= new Date('${value.ToDate}')`;
        }
      }
    }
    return result;
  }
}