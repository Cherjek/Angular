import { map } from 'rxjs/operators';
import { AppConfig } from 'src/app/app.config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class AdvertService {
  queryCode: string;
  private readonly localStorageCode = 'advertQueryCode';

  constructor(private httpService: HttpClient, private appConfig: AppConfig) {}
  configStringConcat = '';

  getAdvert() {
    const location = this.appConfig.getConfig('advertisingConfigUrl');
    if (location) {
      return this.httpService.get(location).pipe(
        map((result: any) => {
          if (result) {
            this.advertProcess();
            if (result && this.queryCode) {
              const banner = (result.banners || []).find(
                (x: any) =>
                  x && (x.code as string).toLocaleUpperCase() === this.queryCode
              );
              // check for malicious code
              if (banner) {
                const stringConcat = this.getStrings(banner);
                const hasJs = this.checkForJs(stringConcat);
                if (hasJs) {
                  return null;
                } else {
                  return banner;
                }
              }
            }
          } else {
            return null;
          }
        })
      );
    } else {
      return of(null);
    }
  }

  advertProcess() {
    this.getUrlCode();
    this.saveToLocal();
  }

  private getUrlCode() {
    const url = (window.location.href || '').toLocaleLowerCase();
    const code = 'bannercode';
    if (url.includes('?') && url.includes(code)) {
      const substr = url.substr(url.indexOf(code));
      const bannerCode = substr.slice(
        substr.indexOf('bannercode=') + 11,
        substr.includes('&') ? substr.indexOf('&') : substr.length
      );
      this.queryCode = bannerCode.toLocaleUpperCase();
      if (!this.queryCode) {
        this.queryCode = this.getFromLocal();
      }
    } else {
      this.queryCode = this.getFromLocal();
    }
  }

  private getStrings(obj: any) {
    if (this.isObject(obj)) {
      Object.values(obj).forEach((val) => {
        this.getStrings(val);
      });
    } else {
      this.configStringConcat += obj;
    }
    return this.configStringConcat;
  }

  private isObject(obj: object) {
    return obj !== null && obj.constructor.name === 'Object';
  }

  private checkForJs(str: string) {
    const jsKeywords = ['script', 'eval'];
    return jsKeywords.filter((x) =>
      str.toLocaleLowerCase().includes(x.toLocaleLowerCase())
    ).length;
  }

  private saveToLocal() {
    localStorage.setItem(this.localStorageCode, this.queryCode);
  }

  private getFromLocal() {
    return localStorage.getItem(this.localStorageCode);
  }
}
