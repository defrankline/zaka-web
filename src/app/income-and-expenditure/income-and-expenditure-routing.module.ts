import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IncomeAndExpenditureComponent} from './income-and-expenditure.component';
import {AuthGuard} from "../auth/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: IncomeAndExpenditureComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'contribution-payments',
    loadChildren: () => import('./contribution-payment/contribution-payment.module').then(m => m.ContributionPaymentModule),
    data: {title: 'Contribution Payments', breadcrumb: 'Contribution Payments'},
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncomeAndExpenditureRoutingModule {
}
