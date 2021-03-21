import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OptionCardComponent } from './components/option-card/option-card.component';
import { PropertyComponent } from './components/property/property.component';


const routes: Routes = [{
    path: '',
    component: OptionCardComponent,
    children: [
        {
            path: '', redirectTo: 'property',
        }, {
            path: 'property',
            component: PropertyComponent
        }]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeviceCommandParameterOptionRoutingModule { }
