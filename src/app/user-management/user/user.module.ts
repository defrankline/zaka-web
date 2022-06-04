import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import {UserRoutingModule} from './user-routing.module';
import { FormComponent } from './form/form.component';
import { UploadComponent } from './upload/upload.component';
import {UserRoleListComponent} from './user-role-list';
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [
    UserComponent,
    FormComponent,
    UserRoleListComponent,
    UploadComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule
  ]
})
export class UserModule { }
