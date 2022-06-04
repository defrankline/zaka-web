import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrategyComponent } from './strategy.component';
import { FormComponent } from './form/form.component';
import {SharedModule} from '../../../shared/shared.module';
import {StrategyRoutingModule} from './strategy-routing.module';

@NgModule({
  declarations: [StrategyComponent, FormComponent],
  imports: [
    CommonModule,
    SharedModule,
    StrategyRoutingModule
  ]
})
export class StrategyModule { }
