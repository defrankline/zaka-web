import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {NgxPermissionsModule} from 'ngx-permissions';
import {IconService} from './services/icon.service';
import {DomSanitizer, Title} from '@angular/platform-browser';
import {FooterComponent} from './footer/footer.component';
import {AboutComponent} from './about/about.component';
import {ViewLoanGuarantorListComponent} from './view-loan-guarantor-list';
import {ViewLoanCollateralListComponent} from './view-loan-collateral-list';
import {ViewLoanUsageListComponent} from './view-loan-usage-list';
import {ViewMemberFinancialProfileComponent} from './view-member-financial-profile';
import {ViewPdfAttachmentComponent} from './view-pdf-attachment';
import {ViewImageAttachmentComponent} from './view-image-attachment';
import {ViewLoanRepaymentScheduleListComponent} from './view-loan-repayment-schedule-list';
import {MaterialModule} from './material.module';
import {CURRENCY_MASK_CONFIG, CurrencyMaskConfig, CurrencyMaskModule} from 'ng2-currency-mask';
import {TranslateModule} from '@ngx-translate/core';
import {NgbPopoverModule} from '@ng-bootstrap/ng-bootstrap';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NguCarouselModule} from '@ngu/carousel';
import {RouterModule} from '@angular/router';
import {InpasswordComponent} from './inpassword/inpassword.component';
import {MatIconRegistry} from '@angular/material/icon';
import {GroupByPipe} from './group-by.pipe';
import {TileComponent} from './tile/tile.component';
import {ViewAttachmentComponent} from './view-attachment';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {MY_FORMATS} from './date-input-format';
import {BaseTableModule} from './base-table/base-table.module';
import {DialogHeaderModule} from './dialog-header/dialog-header.module';
import {SimpleInputModule} from './base-form/simple-input/simple-input.module';
import {SimpleSelectModule} from './base-form/simple-select/simple-select.module';
import {SubmitButtonModule} from './submit-button/submit-button.module';
import {NgxPrintModule} from 'ngx-print';
import {PaymentReceivingAccountComponent} from "./payment-receiving-account/payment-receiving-account.component";

const items = [
  ViewLoanGuarantorListComponent, ViewLoanCollateralListComponent, ViewLoanUsageListComponent,
  InpasswordComponent,
  ViewMemberFinancialProfileComponent, ViewAttachmentComponent, ViewPdfAttachmentComponent,
  ViewImageAttachmentComponent,
  ViewLoanRepaymentScheduleListComponent
];

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
  declarations: [FooterComponent, AboutComponent, TileComponent, items, GroupByPipe, PaymentReceivingAccountComponent],
  imports: [
    CommonModule, RouterModule, MaterialModule, NguCarouselModule, CurrencyMaskModule,
    NgbPopoverModule, FlexLayoutModule,
    TranslateModule
  ],
  exports: [
    NgxPermissionsModule, RouterModule, MaterialModule, NguCarouselModule, CurrencyMaskModule,
    NgbPopoverModule,
    FlexLayoutModule, TranslateModule, GroupByPipe, TileComponent,
    items, FooterComponent, InpasswordComponent,
    BaseTableModule,
    DialogHeaderModule,
    SimpleInputModule,
    SimpleSelectModule,
    SubmitButtonModule,
    NgxPrintModule, PaymentReceivingAccountComponent
  ],
  providers: [
    Title,
    {
      provide: CURRENCY_MASK_CONFIG,
      useValue: CustomCurrencyMaskConfig
    },
    DatePipe,
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
  entryComponents: [items]
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
