import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContributionPaymentComponent} from './contribution-payment.component';

const routes: Routes = [
  {
    path: '', component: ContributionPaymentComponent,
    data: {title: 'Contribution Payments'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContributionPaymentRoutingModule {
}
