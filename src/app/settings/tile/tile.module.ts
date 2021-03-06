import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TileComponent } from './tile.component';
import { FormComponent } from './form/form.component';
import {TileRoutingModule} from './tile-routing.module';
import {TileRoleComponent} from './tile-role/tile-role.component';
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [
    TileComponent,
    FormComponent,
    TileRoleComponent
  ],
  imports: [
    CommonModule,
    TileRoutingModule,
    SharedModule
  ]
})
export class TileModule { }
