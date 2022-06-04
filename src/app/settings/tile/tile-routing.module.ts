import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TileComponent} from './tile.component';
import {FormComponent} from './form/form.component';
import {AuthGuard} from '../../interceptors/auth.guard';
import {TileRoleComponent} from './tile-role/tile-role.component';

const routes: Routes = [
  {path: '', component: TileComponent, canActivate: [AuthGuard], data: {title: 'Tiles'}},
  {path: 'create', component: FormComponent, canActivate: [AuthGuard], data: {title: 'Tile Form'}},
  {path: 'edit/:id', component: FormComponent, canActivate: [AuthGuard], data: {title: 'Tile Form'}},
  {path: 'roles/:id', component: TileRoleComponent, canActivate: [AuthGuard], data: {title: 'Roles'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TileRoutingModule {
}
