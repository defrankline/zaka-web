import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SimpleInputComponent} from './simple-input.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [SimpleInputComponent],
  exports: [
    SimpleInputComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SimpleInputModule { }
