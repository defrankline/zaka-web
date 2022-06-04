import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityComponent } from './activity.component';
import { FormComponent } from './form/form.component';
import {SharedModule} from '../../../../../../shared/shared.module';

@NgModule({
  declarations: [ActivityComponent, FormComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class ActivityModule { }
