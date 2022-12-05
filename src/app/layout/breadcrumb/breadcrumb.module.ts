import {NgModule} from '@angular/core';
import {BreadcrumbComponent} from './breadcrumb.component';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {ClockComponent} from './clock/clock.component';
import {RouterModule} from '@angular/router';


@NgModule({
    declarations: [
        BreadcrumbComponent,
        ClockComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule,
    ],
    exports: [
        BreadcrumbComponent
    ]
})
export class BreadcrumbModule {
}
