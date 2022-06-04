import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../interceptors/auth.guard';
import {SmsComponent} from './sms.component';

const routes: Routes = [
  {path: '', component: SmsComponent, canActivate: [AuthGuard], data: {title: 'Bulk SMS'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsRoutingModule {
}
