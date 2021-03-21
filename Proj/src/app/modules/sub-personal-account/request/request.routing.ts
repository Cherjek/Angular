import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RequestMainComponent } from './components/request-main/request-main.component';

const routes: Routes = [
  {  
    path: '',
    component: RequestMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalAccountRequestRoutes {};
