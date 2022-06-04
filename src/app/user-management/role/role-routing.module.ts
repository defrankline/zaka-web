import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoleComponent} from './role.component';
import {FormComponent} from './form/form.component';
import {TileRoleComponent} from './tile-role/tile-role.component';
import {AuthGuard} from "../../auth/auth.guard";

const routes: Routes = [
  {path: '', component: RoleComponent, canActivate: [AuthGuard], data: {title: 'Roles'}},
  {path: 'create', component: FormComponent, canActivate: [AuthGuard], data: {title: 'Role Form'}},
  {path: 'edit/:id', component: FormComponent, canActivate: [AuthGuard], data: {title: 'Role Form'}},
  {path: 'tiles/:id', component: TileRoleComponent, canActivate: [AuthGuard], data: {title: 'Tiles'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule {
}
