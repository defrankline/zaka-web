import {Injectable} from '@angular/core';
import {SvgIcon} from '../model/svg-icon.model';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  constructor(private domSanitizer: DomSanitizer, private matIconRegistry: MatIconRegistry) {
    matIconRegistry.addSvgIcon(
      'logout',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/logout.svg'
      )
    );

    matIconRegistry.addSvgIcon(
      'person',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/person.svg'
      ));

    matIconRegistry.addSvgIcon(
      'reset',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/reset.svg'
      ));

    matIconRegistry.addSvgIcon(
      'asset',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/machinery.svg'
      ));

    matIconRegistry.addSvgIcon(
      'planning',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/planning.svg'
      ));

    matIconRegistry.addSvgIcon(
      'add_more',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/add-more.svg'
      ));


    matIconRegistry.addSvgIcon(
      'view',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/scan.svg'
      )
    );

    matIconRegistry.addSvgIcon(
      'add',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/plus.svg'));

    matIconRegistry.addSvgIcon(
      'minus',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/minus.svg'));

    matIconRegistry.addSvgIcon(
      'user_account',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/user-account.svg'
      )
    );

    matIconRegistry.addSvgIcon(
      'deposit',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/saving.svg'
      )
    );

    matIconRegistry.addSvgIcon(
      'download',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/download.svg'
      )
    );

    matIconRegistry.addSvgIcon(
      'print',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/print.svg'
      )
    );

    matIconRegistry.addSvgIcon(
      'user_management',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/user-management.svg'
      )
    );

    matIconRegistry.addSvgIcon(
      'share',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/money-bag-with-dollar-symbol.svg'
      )
    );

    matIconRegistry.addSvgIcon(
      'refund',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/refund.svg'
      )
    );

    matIconRegistry.addSvgIcon(
      'refresh',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/refresh.svg'
      )
    );

    matIconRegistry.addSvgIcon(
      'translate',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/translate.svg'
      )
    );

    matIconRegistry.addSvgIcon(
      'cost',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/cost.svg'
      )
    );

    matIconRegistry.addSvgIcon(
      'pdf',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/pdf.svg'
      )
    );

    matIconRegistry.addSvgIcon(
      'administration',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/3d-building.svg'
      )
    );

    matIconRegistry.addSvgIcon(
      'human_resource',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/human-resource.svg'
      )
    );

    matIconRegistry.addSvgIcon(
      'signature',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/digital-signature.svg'
      )
    );

    matIconRegistry.addSvgIcon(
      'approve',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/approve.svg'
      )
    );

    matIconRegistry.addSvgIcon(
      'time',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/time.svg'
      )
    );

    matIconRegistry.addSvgIcon(
      'setup',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/gear.svg'
      )
    );

    matIconRegistry.addSvgIcon(
      'tenant',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/tenant.svg'
      )
    );

    matIconRegistry.addSvgIcon(
      'self_service',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/self-service.svg'
      )
    );

    matIconRegistry.addSvgIcon(
      'saving',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/svg-icons/piggy-bank.svg'
      )
    );

    matIconRegistry.addSvgIcon(
      'statistics',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/statistics.svg'));

    matIconRegistry.addSvgIcon(
      'finance',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/finance.svg'));

    matIconRegistry.addSvgIcon(
      'loan',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/hand-shake.svg'));

    matIconRegistry.addSvgIcon(
      'accounting',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/accounting.svg'));

    matIconRegistry.addSvgIcon(
      'curriculum',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/curriculum.svg'));

    matIconRegistry.addSvgIcon(
      'transaction',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/transaction.svg'));

    matIconRegistry.addSvgIcon(
      'bank',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/bank.svg'));

    matIconRegistry.addSvgIcon(
      'ledger',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/ledger.svg'));

    matIconRegistry.addSvgIcon(
      'id_type',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/id-type.svg'));

    matIconRegistry.addSvgIcon(
      'people',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/group-of-people.svg'));

    matIconRegistry.addSvgIcon(
      'membership',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/team.svg'));

    matIconRegistry.addSvgIcon(
      'family_relation',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/family-tree.svg'));

    matIconRegistry.addSvgIcon(
      'company',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/building.svg'));

    matIconRegistry.addSvgIcon(
      'calculator',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/calculator.svg'));

    matIconRegistry.addSvgIcon(
      'role',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/role.svg'));

    matIconRegistry.addSvgIcon(
      'accepted',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/check.svg'));

    matIconRegistry.addSvgIcon(
      'rejected',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/rejected.svg'));

    matIconRegistry.addSvgIcon(
      'id-card',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/id-card.svg'));


    matIconRegistry.addSvgIcon(
      'tanzania',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/tanzania.svg'));

    matIconRegistry.addSvgIcon(
      'uk',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/uk.svg'));

    matIconRegistry.addSvgIcon(
      'enroll',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/enrol.svg'));

    matIconRegistry.addSvgIcon(
      'delete',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/delete.svg'));

    matIconRegistry.addSvgIcon(
      'sell',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/people-trading.svg'));

    matIconRegistry.addSvgIcon(
      'dispose',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/disposal.svg'));

    matIconRegistry.addSvgIcon(
      'list',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/list.svg'));

    matIconRegistry.addSvgIcon(
      'depreciation',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/depreciation.svg'));

    matIconRegistry.addSvgIcon(
      'expenditure',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/expenditure.svg'));

    matIconRegistry.addSvgIcon(
      'edit',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/edit.svg'));

    matIconRegistry.addSvgIcon(
      'pay',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/pay.svg'));

    matIconRegistry.addSvgIcon(
      'upload',
      domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg-icons/upload.svg'));

  }

  customerIcons: SvgIcon[] = [];
}
