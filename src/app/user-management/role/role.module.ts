import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleComponent } from './role.component';
import {RoleRoutingModule} from './role-routing.module';
import {SharedModule} from '../../utils/shared.module';
import { FormComponent } from './form/form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {TileRoleComponent} from './tile-role/tile-role.component';

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
