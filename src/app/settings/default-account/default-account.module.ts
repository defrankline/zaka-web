import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListComponent} from './list/list.component';
import {FormComponent} from './form/form.component';
import {SharedModule} from '../../utils/shared.module';
import {DefaultLedgerAccountRoutingModule} from './default-ledger-account-routing.module';

@NgModule({
  declarations: [ListComponent, FormComponent],
  imports: [
    CommonModule,
    SharedModule,
    DefaultLedgerAccountRoutingModule
  ],
  entryComponents: [FormComponent]
})
export class DefaultAccountModule {
}
