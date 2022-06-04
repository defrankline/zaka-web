import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../interceptors/auth.guard';
import {LevelComponent as DivisionLevelComponent} from './level.component';
import {FormComponent} from './form/form.component';

const routes: Routes = [
  {path: '', component: DivisionLevelComponent, canActivate: [AuthGuard], data: {title: 'Hierarchy Levels'}},
  {path: 'create', component: FormComponent, canActivate: [AuthGuard], data: {title: 'Hierarchy Level Form'}},
  {path: 'edit/:id', component: FormComponent, canActivate: [AuthGuard], data: {title: 'Hierarchy Level Form'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DivisionLevelRoutingModule {
}
