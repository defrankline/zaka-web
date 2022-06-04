import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TargetComponent} from './target.component';
import {FormComponent} from './form/form.component';
import {TargetRoutingModule} from './target-routing.module';
import {SharedModule} from '../../../shared/shared.module';

@NgModule({
  declarations: [TargetComponent, FormComponent],
  imports: [
    CommonModule,
    TargetRoutingModule,
    SharedModule
  ]
})
export class TargetModule {
}
