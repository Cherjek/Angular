import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OptionsCardComponent } from './components/options-card/options-card.component';
import { OptionsPropertyCardComponent } from './components/options-property-card/options-property-card.component';

const routes: Routes = [
  {
    path: '',
    component: OptionsCardComponent,
    children: [
      { path: '', redirectTo: 'property' },
      {
        path: 'property',
        component: OptionsPropertyCardComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypeDeviceCommandParameterOptionRoutingModule {}
