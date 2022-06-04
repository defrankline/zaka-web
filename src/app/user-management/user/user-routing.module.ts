import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../interceptors/auth.guard';
import {UserComponent} from './user.component';

const routes: Routes = [
  {path: '', component: UserComponent, canActivate: [AuthGuard], data: {title: 'Parishioners'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
