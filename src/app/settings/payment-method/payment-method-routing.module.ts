import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../interceptors/auth.guard';
import {PaymentMethodListComponent} from './payment-method-list';

const routes: Routes = [
  {path: '', component: PaymentMethodListComponent, canActivate: [AuthGuard], data: {title: 'Payment Method'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentMethodRoutingModule {
}
