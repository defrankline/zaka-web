import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LevelComponent } from './level.component';
import { FormComponent } from './form/form.component';
import {DivisionLevelRoutingModule} from './division-level-routing.module';
import {SharedModule} from '../../utils/shared.module';

@NgModule({
  declarations: [
    LevelComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    DivisionLevelRoutingModule,
    SharedModule
  ]
})
export class LevelModule { }
