import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PlanComponent} from './plan.component';
import {ViewComponent} from './view/view.component';
import {ProjectionFormComponent} from '../projection/projection-form.component';

const routes: Routes = [
  {
    path: '', component: PlanComponent,
    data: {
      title: 'Financial Year Plans', breadcrumb: null
    }
  },
  {
    path: 'view/:id', component: ViewComponent,
    data: {
      title: 'Plan', breadcrumb: 'Plan'
    }
  },
  {
    path: 'projection/:id', component: ProjectionFormComponent,
    data: {
      title: 'Create', breadcrumb: 'Create'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanRoutingModule {
}
