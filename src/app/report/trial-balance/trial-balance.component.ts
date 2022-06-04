import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {saveAs} from 'file-saver';
import {LedgerAccount} from '../../settings/account/ledger-account';
import {User} from '../../user-management/user/user';
import {AccountService} from '../../settings/account/account.service';
import {LiturgicalYear} from '../../settings/liturgical-year/liturgical-year';
import {LiturgicalYearService} from '../../settings/liturgical-year/liturgical-year.service';
import {UserService} from '../../user-management/user/user.service';
import {ToastService} from "../../shared/services/toast.service";

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.scss']
})
export class TrialBalanceComponent implements OnInit {

  displayedColumns: string[] = ['id', 'accountName', 'accountNumber', 'debit', 'credit'];
  accounts: LedgerAccount[];
  user: User;
  financialYear: LiturgicalYear;
  accountListSubject: BehaviorSubject<LedgerAccount[]> = new BehaviorSubject(null);

  constructor(private accountService: AccountService,
              private toast: ToastService,
              private financialYearService: LiturgicalYearService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.loadData();
    this.loadCurrentUser();
    this.currentFinancialYear();
  }

  loadData(): void {
    this.accountService.getAccountsWithBalance().subscribe((response) => {
      this.accountListSubject.next(response.data);
    }, error => {
      this.toast.success('Success!','Oops! Data Could Not be loaded!');
    });
  }

  totalDr(): number {
    let total = 0;
    const items = this.accountListSubject.getValue();
    items.map(item => {
      const accountTypeBalanceNature = item.accountGroup.accountSubType.accountType.balanceNature;
      const accountGroupBalanceNature = item.accountGroup.balanceNature;
      if ((accountTypeBalanceNature.toString() === 'DEBIT' && accountGroupBalanceNature.toString() === 'DEBIT')
        || (accountTypeBalanceNature.toString() === 'CREDIT' && accountGroupBalanceNature.toString() === 'DEBIT')) {
        total += item.balance;
      }
    });
    return total;
  }

  totalCr(): number {
    let total = 0;
    const items = this.accountListSubject.getValue();
    items.map(item => {
      const accountTypeBalanceNature = item.accountGroup.accountSubType.accountType.balanceNature;
      const accountGroupBalanceNature = item.accountGroup.balanceNature;
      if ((accountTypeBalanceNature.toString() === 'CREDIT' && accountGroupBalanceNature.toString() === 'CREDIT')
        || (accountTypeBalanceNature.toString() === 'DEBIT' && accountGroupBalanceNature.toString() === 'CREDIT')) {
        total += item.balance;
      }
    });
    return total;
  }

  showDr(item: LedgerAccount): boolean {
    const accountTypeBalanceNature = item.accountGroup.accountSubType.accountType.balanceNature;
    const accountGroupBalanceNature = item.accountGroup.balanceNature;
    if ((accountTypeBalanceNature.toString() === 'DEBIT' && accountGroupBalanceNature.toString() === 'DEBIT')
      || (accountTypeBalanceNature.toString() === 'CREDIT' && accountGroupBalanceNature.toString() === 'DEBIT')) {
      return true;
    } else {
      return false;
    }
  }

  showCr(item: LedgerAccount): boolean {
    const accountTypeBalanceNature = item.accountGroup.accountSubType.accountType.balanceNature;
    const accountGroupBalanceNature = item.accountGroup.balanceNature;
    if ((accountTypeBalanceNature.toString() === 'CREDIT' && accountGroupBalanceNature.toString() === 'CREDIT')
      || (accountTypeBalanceNature.toString() === 'DEBIT' && accountGroupBalanceNature.toString() === 'CREDIT')) {
      return true;
    } else {
      return false;
    }
  }

  getAccounts(): Observable<LedgerAccount[]> {
    return this.accountListSubject.asObservable();
  }

  loadCurrentUser(): void {
    this.userService.currentUser().subscribe((response) => {
      this.user = response.data;
    }, error => {
      this.toast.success('Success!','Oops! Company Details could not be loaded!');
    });
  }

  currentFinancialYear(): void {
    this.financialYearService.currentLiturgicalYear().subscribe((response) => {
      this.financialYear = response.data;
    }, error => {
      this.toast.success('Success!','Oops! Current Year not be loaded!');
    });
  }

  downloadCurrentTrialBalance(): void {
    this.accountService.downloadCurrentTrialBalance().subscribe(response => {
      saveAs(new Blob([response], {type: 'application/pdf'}), Date.now() + '-current-trial-balance.pdf');
    });
  }
}
