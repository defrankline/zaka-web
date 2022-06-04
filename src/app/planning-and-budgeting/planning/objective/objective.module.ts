import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObjectiveComponent } from './objective.component';
import { FormComponent } from './form/form.component';
import {ObjectiveRoutingModule} from './objective-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {TargetModule} from './target/target.module';

@NgModule({
  declarations: [ObjectiveComponent, FormComponent],
  imports: [
    CommonModule,
    ObjectiveRoutingModule,
    SharedModule,
    TargetModule
  ]
})
export class ObjectiveModule { }
