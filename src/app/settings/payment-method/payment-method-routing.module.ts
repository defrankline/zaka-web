import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PaymentMethodListComponent} from './payment-method-list';
import {AuthGuard} from "../../auth/auth.guard";

const routes: Routes = [
  {path: '', component: PaymentMethodListComponent, canActivate: [AuthGuard], data: {title: 'Payment Method'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentMethodRoutingModule {
}
