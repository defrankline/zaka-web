import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityComponent } from './activity.component';
import {ActivityRoutingModule} from './activity-routing.module';
import {SharedModule} from '../../../shared/shared.module';

@NgModule({
  declarations: [ActivityComponent],
  imports: [
    CommonModule,
    ActivityRoutingModule,
    SharedModule
  ]
})
export class ActivityModule { }
