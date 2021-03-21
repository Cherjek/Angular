import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogicDeviceCommandComponent } from './components/ld-command-card/ld-command-card.component';
import { PropertyComponent } from './components/property/property.component';
import { DevicesCommandsComponent } from './components/devices-commands/devices-commands.component';
import { CanAccessGuard } from 'src/app/core';


const routes: Routes = [{
    path: '',
    component: LogicDeviceCommandComponent,
    children: [{
        path: '', redirectTo: 'property',
    }, {
        path: 'property',
        component: PropertyComponent,
        data: { access: 'OE_VIEW_COMMAND', noAccessNavigateTo: 'devices-commands' },
        canActivate: [CanAccessGuard]
    }, {
        path: 'devices-commands',
        component: DevicesCommandsComponent,
        data: { access: 'OE_VIEW_DEVICE_COMMANDS' },
        canActivate: [CanAccessGuard]
    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogicDeviceCommandRoutingModule { }
