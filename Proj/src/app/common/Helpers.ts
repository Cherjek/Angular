import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Helpers {
  isValidURL(url: string) {
    const pattern =
      '^(https?:\\/\\/)?' +
      '((([a-zA-Z\\d]([a-zA-Z\\d-]{0,61}[a-zA-Z\\d])*\\.)+' +
      '[a-zA-Z]{2,13})' +
      '|((\\d{1,3}\\.){3}\\d{1,3})' +
      '|localhost)' +
      '(\\:\\d{1,5})?' +
      '(\\/[a-zA-Z\\&\\d%_.~+-:@]*)*' +
      '(\\?[a-zA-Z\\&\\d%_.,~+-:@=;&]*)?' +
      '(\\#[-a-zA-Z&\\d_]*)?$';
    const regex = new RegExp(pattern);
    return regex.test(url);
  }
}
