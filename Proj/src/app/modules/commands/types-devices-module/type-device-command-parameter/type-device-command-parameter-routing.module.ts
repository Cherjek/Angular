import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParameterComponent } from './components/parameter/parameter.component';
import { ParameterPropertyComponent } from './components/parameter-property/parameter-property.component';
import { ParameterOptionsComponent } from './components/parameter-options/parameter-options.component';


const routes: Routes = [{
    path: '',
    component: ParameterComponent,
    children: [
        { path: '', redirectTo: 'property' },
        {
            path: 'property',
            component: ParameterPropertyComponent,
            // data: { access: 'CFG_DEVICE_VIEW_QUERIES', noAccessNavigateTo: 'logic-devices' },
            // canActivate: [CanAccessGuard]
        },
        {
            path: 'options',
            component: ParameterOptionsComponent,
            // data: { access: 'CFG_DEVICE_VIEW_TAGS' },
            // canActivate: [CanAccessGuard]
        }
    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypeDeviceCommandParameterRoutingModule { }
