import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObjectiveComponent} from './objective.component';
import {FormComponent} from './form/form.component';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [ObjectiveComponent, FormComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class ObjectiveModule {
}
