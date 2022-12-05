import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainLayoutComponent} from "./main-layout/main-layout.component";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import {NavigationComponent} from "./navigation/navigation.component";
import {BreadcrumbModule} from "./breadcrumb/breadcrumb.module";


@NgModule({
    declarations: [
        NavigationComponent,
        MainLayoutComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        SharedModule,
        BreadcrumbModule
    ]
})
export class LayoutModule {
}
