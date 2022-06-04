import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserManagementComponent} from './user-management.component';
import {UserManagementRoutingModule} from './user-management-routing.module';
import {PasswordResetFormComponent} from "./password-reset-form/password-reset-form.component";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations: [
    UserManagementComponent, PasswordResetFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserManagementRoutingModule
  ]
})
export class UserManagementModule {
}
