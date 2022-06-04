import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../interceptors/auth.guard';
import {ReportComponent} from './report.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule {
}
