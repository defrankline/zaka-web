import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SubmitButtonComponent} from './submit-button.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  declarations: [SubmitButtonComponent],
  exports: [
    SubmitButtonComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ]
})
export class SubmitButtonModule {
}
