import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessDirectiveConfig, CanAccessGuard } from '../../../core';
import { AdditionallyPropertyCardComponent } from './components/additionally-property-card.component';
import { PropertyComponent } from './components/property/property.component';

const routes: Routes = [
    {
        path: '',
        component: AdditionallyPropertyCardComponent,
        children: [
            { path: '', redirectTo: 'property' },
            { 
                path: 'property', 
                component: PropertyComponent,
                data: { access: ['HH_TYPE_PROPERTY_VIEW'] },
                canActivate: [CanAccessGuard]
            }
        ]
    }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdditionallyPropertyCardRoutingModule { }
