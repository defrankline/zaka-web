import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {finalize} from 'rxjs/operators';
import {GfsCode} from '../gfs-code';
import {GfsCodeService} from '../gfs-code.service';
import {AccountService} from '../../account/account.service';
import {LedgerAccount} from '../../account/ledger-account';
import {ToastService} from "../../../shared/services/toast.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  loading: boolean;
  action: string;
  title: string;
  formGroup: UntypedFormGroup;
  gfsCode?: GfsCode;
  accounts: LedgerAccount[];
  payingAccounts: LedgerAccount[];

  constructor(
    private gfsCodeService: GfsCodeService,
    private accountService: AccountService,
    private dialogRef: MatDialogRef<FormComponent>,
    private toast: ToastService,
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.loading = false;
    this.action = data.action;
    this.title = data.title;
    if (data.gfsCode !== undefined) {
      this.gfsCode = data.gfsCode;
    }
  }

  ngOnInit(): void {
    this.formGroup = this.initFormGroup();
    this.filterAccounts('_');
    this.filterPayingAccounts('_');
  }

  filterPayingAccounts(value: string): void {
    if (value.length > 0) {
      this.accountService.assetAndLiabilityAccounts(value.toLowerCase()).subscribe((response) => {
        this.payingAccounts = response.data;
      });
    }
  }


  initFormGroup(): UntypedFormGroup {
    if (this.gfsCode === undefined) {
      return this.formBuilder.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        code: ['', Validators.required],
        minAmount: [0, [Validators.required, Validators.min(0)]],
        expenditureType: ['REVENUE', [Validators.required]],
        mandatory: [false],
        account: [null, [Validators.required]],
        payingAccount: [null],
        gfsCodeType: ['REVENUE', [Validators.required]],
      });
    } else {
      return this.formBuilder.group({
        name: [this.gfsCode.name, Validators.required],
        description: [this.gfsCode.description, Validators.required],
        code: [this.gfsCode.code, Validators.required],
        minAmount: [this.gfsCode.minAmount, [Validators.required, Validators.min(0)]],
        expenditureType: [this.gfsCode.expenditureType, [Validators.required]],
        mandatory: [this.gfsCode.mandatory],
        account: [this.gfsCode.account, [Validators.required]],
        payingAccount: [this.gfsCode.payingAccount],
        gfsCodeType: [this.gfsCode.gfsCodeType, [Validators.required]],
      });
    }
  }

  filterAccounts(value: string): void {
    if (value.length > 0) {
      this.accountService.getAll(value.toLowerCase()).subscribe((response) => {
        this.accounts = response.data;
      });
    }
  }

  checkAccount(): void {
    const x = this.formGroup.get('account').value as LedgerAccount;
    if (x === null) {
      this.formGroup.get('account').reset();
    } else {
      if (!x.id) {
        this.formGroup.get('account').reset();
      }
    }
  }

  checkPayingAccount(): void {
    const x = this.formGroup.get('payingAccount').value as LedgerAccount;
    if (x === null) {
      this.formGroup.get('payingAccount').reset();
    } else {
      if (!x.id) {
        this.formGroup.get('payingAccount').reset();
      }
    }
  }

  displayAccount(item: LedgerAccount): string {
    if (item) {
      return item.number + ' - ' + item.name;
    }
  }

  displayPayingAccount(item: LedgerAccount): string {
    if (item) {
      return item.number + ' - ' + item.name;
    }
  }


  store(gfsCode: GfsCode): void {
    if (this.gfsCode === undefined) {
      this.loading = true;
      this.gfsCodeService.store(gfsCode)
        .pipe(finalize(() => this.loading = false))
        .subscribe(response => {
          this.dialogRef.close(response);
        }, error => {
          this.toast.success('Success!',error.error.message);
        });
    } else {
      this.loading = true;
      gfsCode.id = this.gfsCode.id;
      this.gfsCodeService.update(gfsCode)
        .pipe(finalize(() => this.loading = false))
        .subscribe(response => {
          this.dialogRef.close(response);
        }, error => {
          this.toast.success('Success!',error.error.message);
        });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  setCode(): void {
    const account = this.formGroup.get('account').value as LedgerAccount;
    this.formGroup.get('code').setValue(account.number);
    this.formGroup.get('name').setValue(account.name);
    this.formGroup.get('description').setValue(account.name);
  }
}
