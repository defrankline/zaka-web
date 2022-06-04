import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogHeaderComponent } from './dialog-header.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';



@NgModule({
  declarations: [DialogHeaderComponent],
  exports: [
    DialogHeaderComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
  ]
})
export class DialogHeaderModule { }
