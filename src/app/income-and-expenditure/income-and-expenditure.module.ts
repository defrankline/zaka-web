import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IncomeAndExpenditureRoutingModule} from './income-and-expenditure-routing.module';
import { IncomeAndExpenditureComponent } from './income-and-expenditure.component';
import {SharedModule} from '../utils/shared.module';

@NgModule({
  declarations: [
    IncomeAndExpenditureComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    IncomeAndExpenditureRoutingModule
  ]
})
export class IncomeAndExpenditureModule { }
