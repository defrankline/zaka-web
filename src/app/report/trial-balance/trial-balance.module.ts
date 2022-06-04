import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../../shared/shared.module";
import {TrialBalanceComponent} from './trial-balance.component';
import {TrialBalanceRoutingModule} from './trial-balance-routing.module';


@NgModule({
  declarations: [
    TrialBalanceComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TrialBalanceRoutingModule
  ]
})
export class TrialBalanceModule {
}
