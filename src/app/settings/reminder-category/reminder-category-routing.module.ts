import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReminderCategoryComponent} from './reminder-category.component';
import {AuthGuard} from "../../auth/auth.guard";

const routes: Routes = [
  {path: '', component: ReminderCategoryComponent, canActivate: [AuthGuard], data: {title: 'SMS Categories'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReminderCategoryRoutingModule {
}
