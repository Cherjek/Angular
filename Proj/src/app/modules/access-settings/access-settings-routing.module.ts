import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessListComponent } from './containers/access-list/access-list.component';
import { AccessSettingsComponent } from './containers/access-settings/access-settings.component';

const routes: Routes = [
    {
        path: '',
        component: AccessSettingsComponent,
        children: [
            {path: '', redirectTo: 'list'},
            {path: 'list', component: AccessListComponent},
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccessSettingsRoutingModule {
}
