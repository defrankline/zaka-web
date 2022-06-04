import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ObjectiveComponent} from './objective.component';

const routes: Routes = [
  {
    path: '', component: ObjectiveComponent,
    data: {
      title: 'Objectives', breadcrumb: null
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObjectiveRoutingModule {
}
