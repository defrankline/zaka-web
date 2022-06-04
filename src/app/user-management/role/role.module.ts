import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleComponent } from './role.component';
import {RoleRoutingModule} from './role-routing.module';
import { FormComponent } from './form/form.component';
import {TileRoleComponent} from './tile-role/tile-role.component';
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [
    RoleComponent,
    FormComponent,
    TileRoleComponent
  ],
  imports: [
    CommonModule,
    RoleRoutingModule,
    SharedModule,
  ]
})
export class RoleModule { }
