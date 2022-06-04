import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BreakdownComponent} from './breakdown.component';
import {DetailComponent} from './detail/detail.component';
import {SharedModule} from '../../../shared/shared.module';
import {ReceiptComponent} from './receipt/receipt.component';
import { FormComponent } from './form/form.component';


@NgModule({
  declarations: [BreakdownComponent, DetailComponent, ReceiptComponent, FormComponent],
  imports: [
    CommonModule,
    SharedModule,
  ],
  entryComponents: []
})
export class BreakdownModule {
}
