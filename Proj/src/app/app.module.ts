import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './shared/shared.module';

/* main */
import { AppComponent } from './app.component';

/* views */
import { ViewsModule } from './components/cp.module';

/* routes */
import { CONST_ROUTING } from './components/cp.routing';

/* configuration */
import { AppConfig } from './app.config';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AdvertService } from './shared/rom-advert/components/services/advert.service';
// import { HttpClientModule } from '@angular/common/http';
import { TranslocoRootModule } from './transloco/transloco-root.module';

export function appConfigFactory(config: AppConfig) {
  return config.load();
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ViewsModule,
    CONST_ROUTING,
    NgbModule,

    SharedModule,

    // HttpClientModule,

    TranslocoRootModule,
  ],
  providers: [
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: appConfigFactory,
      deps: [AppConfig],
      multi: true,
    },
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    AdvertService,
    {
      provide: APP_INITIALIZER,
      useFactory: (advert: AdvertService) => () => advert.advertProcess(),
      deps: [AdvertService],
      multi: true,
    },
    Title,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
