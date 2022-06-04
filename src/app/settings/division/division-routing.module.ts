import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../interceptors/auth.guard';
import {DivisionComponent} from './division.component';
import {FormComponent} from '../tile/form/form.component';

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
