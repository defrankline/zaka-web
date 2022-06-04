import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DivisionComponent } from './division.component';
import {DivisionRoutingModule} from './division-routing.module';
import {SharedModule} from '../../utils/shared.module';
import { FormComponent } from './form/form.component';


@NgModule({
  declarations: [
    DivisionComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    DivisionRoutingModule,
    SharedModule
  ]
})
export class DivisionModule { }
