import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestPageComponent } from './testPage';
import { TestButtonPageComponent } from './tests-controls/button/buttonPage';
import { EditorsComponent } from './tests-controls/editors/editors.component';
import { ListViewComponent } from './tests-controls/list-view/list-view.component';
import { TreeViewComponent } from './tests-controls/tree-view/tree-view.component';


const routes: Routes = [
    {
        path: '',
        component: TestPageComponent,
        children: [
            {path: '', redirectTo: 'button', pathMatch: 'full'},
            {path: 'button', component: TestButtonPageComponent},
            {path: 'editors', component: EditorsComponent},
            {path: 'list-view', component: ListViewComponent},
            {path: 'tree-view', component: TreeViewComponent},
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestsControlsRoutingModule { }
