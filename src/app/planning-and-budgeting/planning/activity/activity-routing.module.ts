import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ActivityComponent} from './activity.component';

const routes: Routes = [
  {
    path: '', component: ActivityComponent,
    data: {
      title: 'Activities', breadcrumb: null
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityRoutingModule {
}
