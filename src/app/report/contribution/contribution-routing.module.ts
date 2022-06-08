import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContributionComponent} from "./contribution.component";

const routes: Routes = [
  {
    path: '', component: ContributionComponent,
    data: {title: 'Contributions', breadcrumb: 'Contributions'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContributionRoutingModule {
}
