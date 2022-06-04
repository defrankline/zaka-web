import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DivisionComponent } from './division.component';
import {DivisionRoutingModule} from './division-routing.module';
import { FormComponent } from './form/form.component';
import {SharedModule} from "../../shared/shared.module";


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
