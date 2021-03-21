import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommandCardComponent } from './components/command-card/command-card.component';
import { PropertyComponent } from './components/property/property.component';
import { ParametersComponent } from './components/parameters/parameters.component';


const routes: Routes = [{
    path: '',
    component: CommandCardComponent,
    children: [
        { path: '', redirectTo: 'property' },
        {
            path: 'property',
            component: PropertyComponent,
            // data: { access: 'CFG_DEVICE_VIEW_QUERIES', noAccessNavigateTo: 'logic-devices' },
            // canActivate: [CanAccessGuard]
        },
        {
            path: 'params',
            component: ParametersComponent,
            // data: { access: 'CFG_DEVICE_VIEW_TAGS' },
            // canActivate: [CanAccessGuard]
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TypeDeviceCommandRoutingModule { }
