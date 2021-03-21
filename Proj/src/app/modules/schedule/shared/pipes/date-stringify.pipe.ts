import { AppLocalization } from 'src/app/common/LocaleRes';
import { Pipe, PipeTransform } from '@angular/core';
import { Common } from 'src/app/common/Constants';

import Constants = Common.Constants;
@Pipe({
  name: 'dateStringify'
})
export class DateStringifyPipe implements PipeTransform {
  transform(arr: any[], durationType: any): any {
    const months = Constants.CALENDAR_RU.monthNames as string[];
    const weeks = Constants.CALENDAR_RU.dayNamesShortAlt as string[];
    let result = arr;
    if (durationType === 'month') {
      result = arr.sort((a, b) => a - b).map(x => months[x - 1]);
    } else if (durationType === 'week') {
      result = arr.sort((a, b) => a - b).map(x => weeks[x - 1]);
    } else if (durationType === 'customMonth' || durationType === 'customOrders') {
      const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: 'base'
      });
      result = arr
        .map(x => {
          if (x < 0) {
            x = durationType === 'customMonth' ? AppLocalization.Label63 : AppLocalization.Label62;
          }
          return x;
        })
        .sort(collator.compare);
    }
    return result.join(', ');
  }
}