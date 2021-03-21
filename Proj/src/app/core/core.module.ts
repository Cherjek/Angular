import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from './interceptors/http.token.interceptor';

// import { TranslocoModule, TRANSLOCO_SCOPE } from '@ngneat/transloco';
/**
 * https://ngneat.github.io/transloco/docs/scope-configuration
 */

 import { TranslocoRootModule } from '../transloco/transloco-root.module';

@NgModule({
    imports: [
      CommonModule,
      TranslocoRootModule,
      // TranslocoModule      
    ],
    exports: [
      TranslocoRootModule,
      // TranslocoModule
    ],
    providers: [
      { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
      // { provide: TRANSLOCO_SCOPE, useValue: 'trnsloco' }
    ],
    declarations: []
})
export class CoreModule { }