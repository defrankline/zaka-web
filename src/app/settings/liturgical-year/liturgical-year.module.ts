import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiturgicalYearComponent } from './liturgical-year.component';
import { FormComponent } from './form/form.component';
import {SharedModule} from '../../utils/shared.module';
import {LiturgicalYearRoutingModule} from './liturgical-year-routing.module';

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
