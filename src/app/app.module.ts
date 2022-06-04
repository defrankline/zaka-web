import {NgModule} from '@angular/core';
import {ToastrModule} from 'ngx-toastr';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {NgxPermissionsModule} from 'ngx-permissions';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {LayoutModule} from './layout/layout.module';
import {SharedModule} from './shared/shared.module';
import {HttpConfigInterceptor} from './auth/interceptor.service';
import {HttpLoaderFactory} from './http-loader-factory';
import {LoaderInterceptor} from './loader-interceptor';
import {ServerDownHandlerInterceptor} from './auth/server-down-handler.interceptor';
import {NgIdleKeepaliveModule} from "@ng-idle/keepalive";
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserModule,
    LayoutModule,
    BrowserAnimationsModule,
    NgxMatSelectSearchModule,
    NgxPermissionsModule.forRoot(),
    ToastrModule.forRoot(),
    SharedModule,
    ModalModule,
    RouterModule.forRoot([], {useHash: true}),
    FlexLayoutModule,
    HttpClientModule,

    NgIdleKeepaliveModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerDownHandlerInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule {
}
