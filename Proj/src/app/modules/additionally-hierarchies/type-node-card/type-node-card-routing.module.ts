import { NgModule } from '@angular/core';
import { AccessDirectiveConfig, CanAccessGuard } from '../../../core';

import { RouterModule, Routes } from '@angular/router';
import { TypeNodeCardComponent } from './components/type-node-card.component';

import { PropertyComponent } from './components/property/property.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { AddPropertiesComponent } from './components/add-properties/add-properties.component';

const routes: Routes = [
    {
        path: '',
        component: TypeNodeCardComponent,
        children: [
            { path: '', redirectTo: 'property' },
            { 
                path: 'property', 
                component: PropertyComponent,
                data: { access: ['HH_TYPE_VIEW'], noAccessNavigateTo: 'add-properties' },
                canActivate: [CanAccessGuard]
            },
            { 
                path: 'add-properties', 
                component: AddPropertiesComponent,
                data: { access: ['HH_TYPE_PROPERTIES_VIEW'], noAccessNavigateTo: 'categories' },
                canActivate: [CanAccessGuard]
            },
            { 
                path: 'categories', component: CategoriesComponent,
                data: { access: ['HH_TYPE_CATEGORIES_VIEW'] },
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
export class TypeNodeCardRoutingModule { }
