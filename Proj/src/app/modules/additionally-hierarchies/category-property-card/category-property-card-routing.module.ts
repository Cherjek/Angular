import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessDirectiveConfig, CanAccessGuard } from '../../../core';
import { CategoryPropertyCardComponent } from './components/category-property-card.component';
import { PropertyComponent } from './components/property/property.component';

const routes: Routes = [
    {
        path: '',
        component: CategoryPropertyCardComponent,
        children: [
            { path: '', redirectTo: 'property' },
            { 
                path: 'property', 
                component: PropertyComponent,
                data: { access: ['HH_TYPE_CATEGORY_VIEW'] },
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
export class CategoryPropertyCardRoutingModule { }
