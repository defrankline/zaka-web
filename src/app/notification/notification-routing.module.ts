import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotificationComponent} from './notification.component';
import {AuthGuard} from "../auth/auth.guard";

const routes: Routes = [
  {path: '', component: NotificationComponent, canActivate: [AuthGuard], data: {title: 'Notifications'}},
  {
    path: 'bulk-sms',
    loadChildren: () => import('./sms/sms.module').then(m => m.SmsModule),
    data: {title: 'Bulk SMS'},
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule {
}
