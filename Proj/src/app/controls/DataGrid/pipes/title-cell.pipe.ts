import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleCell'
})
export class TitleCellPipe implements PipeTransform {

  transform(value: any, args?: string[]): any {
    if (value != null) {
      if (typeof value === 'object') {
        if (args != null) {
          return (args.map(x => value[x])).join(' ');
        }
      }
    }
    return value;
  }

}
