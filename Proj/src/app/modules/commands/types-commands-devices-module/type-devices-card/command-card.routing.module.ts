import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommandCardComponent } from './components/command-card/command-card.component';
import { CommandCardPropertiesComponent } from './components/command-card-properties/command-card-properties.component';

const routes: Routes = [
  {
    path: '',
    component: CommandCardComponent,
    children: [
      {
        path: '',
        redirectTo: 'property'
      },
      {
        path: 'property',
        component: CommandCardPropertiesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class CommandCardRoutingModule {}
