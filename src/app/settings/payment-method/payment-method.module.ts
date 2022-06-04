import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaymentMethodRoutingModule} from './payment-method-routing.module';
import {PaymentMethodListComponent} from './payment-method-list';
import {PaymentMethodFormComponent} from './payment-method-form';
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [PaymentMethodListComponent, PaymentMethodFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    PaymentMethodRoutingModule
  ],
  providers: [],
  entryComponents: []
})
export class PaymentMethodModule {
}
