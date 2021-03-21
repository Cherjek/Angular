import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommandCreateComponent } from './components/command-create/command-create.component';


const routes: Routes = [{
    path: '',
    component: CommandCreateComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CommandCreateRoutingModule { }
