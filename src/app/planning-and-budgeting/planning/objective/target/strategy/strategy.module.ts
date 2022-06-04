import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrategyComponent } from './strategy.component';
import { FormComponent } from './form/form.component';
import {SharedModule} from '../../../../../shared/shared.module';
import {ActivityModule} from './activity/activity.module';

@NgModule({
  declarations: [StrategyComponent, FormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ActivityModule
  ]
})
export class StrategyModule { }
