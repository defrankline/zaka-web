import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TargetComponent} from './target.component';
import {FormComponent} from './form/form.component';
import {SharedModule} from '../../../../shared/shared.module';
import {StrategyModule} from './strategy/strategy.module';

@NgModule({
  declarations: [TargetComponent, FormComponent],
  imports: [
    CommonModule,
    SharedModule,
    StrategyModule
  ]
})
export class TargetModule {
}
