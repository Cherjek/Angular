import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessListComponent } from './containers/access-list/access-list.component';
import { AccessListNavComponent } from './components/access-list-nav/access-list-nav.component';
import { AccessListInfoComponent } from './components/access-list-info/access-list-info.component';
import { AccessSettingsComponent } from './containers/access-settings/access-settings.component';
import { AccessSettingsRoutingModule } from './access-settings-routing.module';
import { ControlsModule } from '../../controls/ct.module';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';

@NgModule({
    declarations: [
        AccessListComponent,
        AccessListNavComponent,
        AccessListInfoComponent,
        AccessSettingsComponent,
    ],
    imports: [
        CommonModule,
        AccessSettingsRoutingModule,
        ControlsModule,
        ScrollDispatchModule,
    ]
})
export class AccessSettingsModule {
}
