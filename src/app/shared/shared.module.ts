import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {NgxPermissionsModule} from 'ngx-permissions';
import {IconService} from './services/icon.service';
import {DomSanitizer, Title} from '@angular/platform-browser';
import {FooterComponent} from './footer/footer.component';
import {AboutComponent} from './about/about.component';
import {MaterialModule} from './material.module';
import {CURRENCY_MASK_CONFIG, CurrencyMaskConfig, CurrencyMaskModule} from 'ng2-currency-mask';
import {TranslateModule} from '@ngx-translate/core';
import {NgbPopoverModule} from '@ng-bootstrap/ng-bootstrap';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NguCarouselModule} from '@ngu/carousel';
import {RouterModule} from '@angular/router';
import {MatIconRegistry} from '@angular/material/icon';
import {GroupByPipe} from './group-by.pipe';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {MY_FORMATS} from './date-input-format';
import {BaseTableModule} from './base-table/base-table.module';
import {DialogHeaderModule} from './dialog-header/dialog-header.module';
import {SimpleInputModule} from './base-form/simple-input/simple-input.module';
import {SimpleSelectModule} from './base-form/simple-select/simple-select.module';
import {NgxPrintModule} from 'ngx-print';
import {TreeModule} from "@circlon/angular-tree-component";
import {ModalModule} from "ngx-bootstrap/modal";
import {PaginationModule} from "ngx-bootstrap/pagination";

const items = [];

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'right',
  allowNegative: true,
  decimal: '.',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: ','
};

@NgModule({
    declarations: [FooterComponent, AboutComponent, items, GroupByPipe],
    imports: [
        CommonModule, RouterModule, TreeModule, MaterialModule, NguCarouselModule, CurrencyMaskModule,
        NgbPopoverModule, FlexLayoutModule, ModalModule,
        TranslateModule
    ],
    exports: [
        NgxPermissionsModule, RouterModule, TreeModule, MaterialModule, NguCarouselModule, CurrencyMaskModule,
        NgbPopoverModule,
        FlexLayoutModule, ModalModule, TranslateModule, GroupByPipe,
        items, FooterComponent,
        BaseTableModule,
        DialogHeaderModule,
        SimpleInputModule,
        SimpleSelectModule,
        NgxPrintModule,
        PaginationModule
    ],
    providers: [
        Title,
        {
            provide: CURRENCY_MASK_CONFIG,
            useValue: CustomCurrencyMaskConfig
        },
        DatePipe,
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ]
})
export class SharedModule {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private svgIconService: IconService,
    private domSanitizer: DomSanitizer
  ) {
    this.svgIconService.customerIcons.forEach(row => {
      this.matIconRegistry.addSvgIconLiteral(row.name, this.domSanitizer.bypassSecurityTrustHtml(row.tag)
      );
    });
  }
}
