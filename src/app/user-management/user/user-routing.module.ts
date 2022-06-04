import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from './user.component';
import {AuthGuard} from "../../auth/auth.guard";

const routes: Routes = [
  {path: '', component: UserComponent, canActivate: [AuthGuard], data: {title: 'Parishioners'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
