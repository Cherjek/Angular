import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from '../../controls/ct.module';

import { PersonalAccountRoutingModule } from './personal-account-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';

import { DisableContainerComponent } from './containers/disable-container/disable-container.component';
import { TableContainerComponent } from './containers/table-container/table-container.component';
import { PersonalAccountComponent } from './components/personal-account/personal-account.component';
import { CommonTypeComponent } from './components/dynamic/common-type/common-type.component';
import { SpecificTypeComponent } from './components/dynamic/specific-type/specific-type.component';
import { DetailsContentViewHostDirective } from './directives/details-content-view-host.directive';

import { PersonalAccountService } from '../../services/personalaccount.module/PersonalAccount.service';

@NgModule({
    declarations: [
        DisableContainerComponent,
        TableContainerComponent,
        PersonalAccountComponent,
        CommonTypeComponent,
        SpecificTypeComponent,
        DetailsContentViewHostDirective
    ],
    imports: [
        CommonModule,
        ControlsModule,

        PersonalAccountRoutingModule,
        SharedModule,
        CoreModule
    ],
    providers: [
        PersonalAccountService
    ],
    entryComponents: [
        CommonTypeComponent,
        SpecificTypeComponent
    ]
})
export class PersonalAccountModule {
}
