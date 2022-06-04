import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingPageComponent} from './landing-page.component';

const routes: Routes = [
  {
    path: '', component: LandingPageComponent, data: {
      title: 'Welcome', breadcrumb: null
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingPageRoutingModule {
}
