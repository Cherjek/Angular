import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from 'src/app/core';

@Pipe({
  name: 'dateSlice',
})
export class DateSlicePipe implements PipeTransform {
  transform(value: string, args?: any): any {
    if ((args || '').toLocaleLowerCase() === 'month') {
      return Utils.DateFormat.Instance.getDateMonth(value);
    }
    return null;
  }
}
