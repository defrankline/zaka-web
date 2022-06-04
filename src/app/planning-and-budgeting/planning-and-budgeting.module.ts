import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PlanningAndBudgetingRoutingModule} from './planning-and-budgeting-routing.module';
import {SharedModule} from '../shared/shared.module';
import {PlanningAndBudgetingComponent} from './planning-and-budgeting.component';



@NgModule({
  declarations: [PlanningAndBudgetingComponent],
  imports: [
    CommonModule,
    SharedModule,
    PlanningAndBudgetingRoutingModule
  ]
})
export class PlanningAndBudgetingModule { }
