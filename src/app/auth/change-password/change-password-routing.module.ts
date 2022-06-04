import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChangePasswordComponent} from "./change-password.component";

const routes: Routes = [
  {path: '', component: ChangePasswordComponent, data: {title: 'Change Password', breadcrumb: null}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangePasswordRoutingModule { }
