import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class Truncate implements PipeTransform {
  transform(value: string, limit = 30, truncateWords = true, ellipsis = '...') {
    if (!value) { return value; }
    limit = truncateWords ? value.substr(0, limit).lastIndexOf(' ') : limit;
    return value.length > limit ? value.substr(0, limit) + ellipsis : value;
  }
}
