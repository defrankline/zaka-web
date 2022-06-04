import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContributionSetupComponent} from './contribution-setup.component';

const routes: Routes = [
  {
    path: '', component: ContributionSetupComponent, data: {title: 'Contribution Setup'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContributionSetupRoutingModule {
}
