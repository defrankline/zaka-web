import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmsComponent } from './sms.component';
import { FormComponent } from './form/form.component';
import { RecipientComponent } from './recipient/recipient.component';
import {SharedModule} from '../../utils/shared.module';
import {SmsRoutingModule} from './sms-routing.module';

@NgModule({
  declarations: [SmsComponent, FormComponent, RecipientComponent],
  imports: [
    CommonModule,
    SharedModule,
    SmsRoutingModule
  ]
})
export class SmsModule { }
