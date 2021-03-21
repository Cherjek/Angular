import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParameterCardComponent } from './components/parameter-card/parameter-card.component';
import { PropertyComponent } from './components/property/property.component';
import { OptionsComponent } from './components/options/options.component';


const routes: Routes = [{
    path: '',
    component: ParameterCardComponent,
    children: [{
        path: '', redirectTo: 'property',
    }, {
        path: 'property',
        component: PropertyComponent,
        // data: { access: 'CFG_DEVICE_VIEW_QUERIES', noAccessNavigateTo: 'logic-devices' },
        // canActivate: [CanAccessGuard]
    }, {
        path: 'options',
        component: OptionsComponent,
        // data: { access: 'CFG_DEVICE_VIEW_QUERIES', noAccessNavigateTo: 'logic-devices' },
        // canActivate: [CanAccessGuard]
    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceCommandParameterRoutingModule { }
