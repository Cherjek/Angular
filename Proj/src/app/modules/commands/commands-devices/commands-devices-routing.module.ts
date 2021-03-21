import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommandCardComponent } from './components/command-card/command-card.component';
import { PropertyComponent } from './components/property/property.component';
import { ParametersComponent } from './components/parameters/parameters.component';
import { CanAccessGuard } from 'src/app/core';


const routes: Routes = [{
    path: '',
    component: CommandCardComponent,
    children: [{
        path: '', redirectTo: 'property',
    }, {
        path: 'property',
        component: PropertyComponent,
        data: { access: 'OE_VIEW_DEVICE_COMMAND' },
        canActivate: [CanAccessGuard]
    }, {
        path: 'params',
        component: ParametersComponent,
        data: { access: 'OE_VIEW_DEVICE_COMMAND' },
        canActivate: [CanAccessGuard]
    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommandsDevicesRoutingModule { }
