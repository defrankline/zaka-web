import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FundSourceComponent} from './fund-source.component';
import {FormComponent} from './form/form.component';
import {SharedModule} from '../../../shared/shared.module';
import {FundSourceRoutingModule} from './fund-source-routing.module';

@NgModule({
  declarations: [FundSourceComponent, FormComponent],
  imports: [
    CommonModule,
    SharedModule,
    FundSourceRoutingModule
  ]
})
export class FundSourceModule {
}
