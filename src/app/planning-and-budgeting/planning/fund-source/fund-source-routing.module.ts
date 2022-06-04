import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FundSourceComponent} from './fund-source.component';

const routes: Routes = [
  {
    path: '', component: FundSourceComponent,
    data: {
      title: 'Fund Sources', breadcrumb: null
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FundSourceRoutingModule {
}
