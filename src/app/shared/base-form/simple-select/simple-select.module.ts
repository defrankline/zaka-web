import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SimpleSelectComponent} from './simple-select.component';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [SimpleSelectComponent],
  exports: [
    SimpleSelectComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SimpleSelectModule { }
