import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SmsComponent} from './sms.component';
import {AuthGuard} from "../../auth/auth.guard";

const routes: Routes = [
  {path: '', component: SmsComponent, canActivate: [AuthGuard], data: {title: 'Bulk SMS'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsRoutingModule {
}
