import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DivisionComponent} from './division.component';
import {FormComponent} from '../tile/form/form.component';
import {AuthGuard} from "../../auth/auth.guard";

const routes: Routes = [
  {path: '', component: DivisionComponent, canActivate: [AuthGuard], data: {title: 'Divisions'}},
  {path: 'create', component: FormComponent, canActivate: [AuthGuard], data: {title: 'Division Form'}},
  {path: 'edit/:id', component: FormComponent, canActivate: [AuthGuard], data: {title: 'Division Form'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DivisionRoutingModule {
}
