import { Pipe, PipeTransform } from '@angular/core';
import * as ConstNamespace from '../../common/Constants';
import Constants = ConstNamespace.Common.Constants;

@Pipe({
  name: 'decimalFormat'
})
export class DecimalFormatPipe implements PipeTransform {
  transform(num: number,
            thousand_delimeter: string = Constants.DECIMAL_FORMAT.THOUSAND_DELIMETER,
            fract_separator: string = Constants.DECIMAL_FORMAT.FRACTIONAL_SEPARATOR,
            fract_width: number = Constants.DECIMAL_FORMAT.FRACTIONAL_WIDTH): any {
    if (num == null) {
      return num;
    }
    if (typeof num !== 'number') {
      num = parseFloat('' + num);
    }

    const numDec = Math.trunc(num);
    const valFract = Math.pow(10, fract_width);
    let numFloat = Math.trunc(num * valFract) / valFract;
    numFloat = numFloat - numDec;
    let numFloatStr = numFloat.toFixed(fract_width);
    numFloat = parseFloat(numFloatStr);

    const abs = num < 0 ? -1 : 1;
    const absStr = abs < 0 ? '-' : '';

    numFloatStr = numFloatStr.substring(numFloatStr.indexOf(fract_separator) + 1);

    let numDecStr = ('' + Math.abs(numDec));
    for (let i = numDecStr.length; i >= 1; i--) {
      if (i < numDecStr.length && i % 3 === 0) {
        const k = numDecStr.length - i;
        numDecStr = numDecStr.slice(0, k) + thousand_delimeter + numDecStr.slice(k);
      }
    }
    return `${absStr}${numDecStr}${fract_separator}${numFloatStr}`;
  }
}
