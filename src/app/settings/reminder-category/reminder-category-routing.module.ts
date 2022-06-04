import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../interceptors/auth.guard';
import {ReminderCategoryComponent} from './reminder-category.component';

const routes: Routes = [
  {path: '', component: ReminderCategoryComponent, canActivate: [AuthGuard], data: {title: 'SMS Categories'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReminderCategoryRoutingModule {
}
