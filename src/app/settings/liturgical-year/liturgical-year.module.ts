import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiturgicalYearComponent } from './liturgical-year.component';
import { FormComponent } from './form/form.component';
import {LiturgicalYearRoutingModule} from './liturgical-year-routing.module';
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [
    LiturgicalYearComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LiturgicalYearRoutingModule
  ]
})
export class LiturgicalYearModule { }
