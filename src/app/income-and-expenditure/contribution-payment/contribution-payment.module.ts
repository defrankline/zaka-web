import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContributionPaymentComponent} from './contribution-payment.component';
import {FormComponent} from './form/form.component';
import {SharedModule} from "../../shared/shared.module";
import {ContributionPaymentRoutingModule} from './contribution-payment-routing.module';
import {UploadComponent} from './upload/upload.component';


@NgModule({
  declarations: [
    ContributionPaymentComponent,
    FormComponent,
    UploadComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ContributionPaymentRoutingModule
  ]
})
export class ContributionPaymentModule {
}
