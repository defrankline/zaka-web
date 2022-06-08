import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReportComponent} from './report.component';
import {AuthGuard} from "../auth/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'trial-balance',
    loadChildren: () => import('./trial-balance/trial-balance.module').then(m => m.TrialBalanceModule),
    data: {title: 'Trial Balance'},
    canActivate: [AuthGuard]
  },
  {
    path: 'contributions',
    loadChildren: () => import('./contribution/contribution.module').then(m => m.ContributionModule),
    data: {title: 'Contributions'},
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule {
}
