/*
 * Pipe для перевода пустого текста в [Без названия]
 */
import * as ConstNamespace from '../../common/Constants';
import Constants = ConstNamespace.Common.Constants;
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeNoName'
})
export class NoNamePipe implements PipeTransform {
  transform(text: string): any {
    if (!text || text === 'null') {
      return Constants.NO_NAME;
    }
    return text;
  }
}
