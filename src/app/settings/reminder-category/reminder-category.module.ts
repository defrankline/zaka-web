import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReminderCategoryComponent } from './reminder-category.component';
import { FormComponent } from './form/form.component';
import {ReminderCategoryRoutingModule} from './reminder-category-routing.module';
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [ReminderCategoryComponent, FormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReminderCategoryRoutingModule
  ]
})
export class ReminderCategoryModule { }
