import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../interceptors/auth.guard';
import {LiturgicalYearComponent} from './liturgical-year.component';

const routes: Routes = [
  {path: '', component: LiturgicalYearComponent, canActivate: [AuthGuard], data: {title: 'Liturgical Years'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiturgicalYearRoutingModule {
}
