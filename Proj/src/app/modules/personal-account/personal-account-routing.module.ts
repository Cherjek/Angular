import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalAccountComponent } from "./components/personal-account/personal-account.component";

const routes: Routes = [
    {
        path: '',
        component: PersonalAccountComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PersonalAccountRoutingModule {
}
