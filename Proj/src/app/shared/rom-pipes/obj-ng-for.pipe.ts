import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ObjNgFor',
    pure: false
})
export class ObjNgForPipe implements PipeTransform {
    transform(value: any, args: any[] = null): any {
        if (value) {
            return Object.keys(value).map(key => value[key]);
        } else {
            return value;
        }
    }
}