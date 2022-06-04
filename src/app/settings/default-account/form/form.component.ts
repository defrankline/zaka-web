import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

import {finalize} from 'rxjs/operators';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DefaultAccount} from '../default-account';
import {DefaultAccountService} from '../default-account.service';
import {LedgerAccount} from '../../account/ledger-account';
import {AccountService} from '../../account/account.service';
import {ToastService} from '../../../utils/toast/toast.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  loading: boolean;
  action: string;
  title: string;
  formGroup: FormGroup;
  defaultAccount: DefaultAccount;
  storeSubscription: Subscription;
  subscribeStore: boolean;
  isLoading = false;
  filteredAccounts: Account[] = [];

  constructor(
    private defaultAccountService: DefaultAccountService,
    private dialogRef: MatDialogRef<FormComponent>,
    private toast: ToastService,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.loading = false;
    this.subscribeStore = false;
    this.action = data.action;
    this.title = data.title;
    if (this.action === 'update') {
      this.defaultAccount = data.defaultAccount;
    }
  }

  ngOnInit(): void {
    this.formGroup = this.initFormGroup();
  }

  close(): void {
    this.dialogRef.close();
  }


  initFormGroup(): FormGroup {
    if (this.action === 'create') {
      return this.formBuilder.group({
        key: ['', Validators.required],
        account: [null, Validators.required],
      });
    } else {
      return this.formBuilder.group({
        id: [this.defaultAccount.id, Validators.required],
        key: [this.defaultAccount.key, Validators.required],
        account: [this.defaultAccount.account, Validators.required],
      });
    }
  }


  filter(value: string): void {
    if (value.length > 1) {
      this.isLoading = true;
      this.accountService.getAll(value.toLowerCase()).subscribe((response) => {
        this.filteredAccounts = response.data;
        this.isLoading = false;
      }, error => {
        this.isLoading = false;

      });
    }
  }

  displayFn(account: LedgerAccount): string {
    if (account) {
      return account.number + ' - ' + account.name;
    }
  }


  store(defaultAccount: DefaultAccount): void {
    if (this.action === 'create') {
      this.loading = true;
      this.defaultAccountService.store(defaultAccount)
        .pipe(finalize(() => this.loading = false))
        .subscribe(response => {
          this.dialogRef.close(response);
        }, error => {
          this.toast.show(error.error.message);
        });
    } else {
      this.loading = true;
      this.storeSubscription = this.defaultAccountService.update(defaultAccount)
        .pipe(finalize(() => this.loading = false))
        .subscribe(response => {
          this.dialogRef.close(response);
        }, error => {
          this.toast.show('DefaultAccount could not be updated!');
        });
    }
  }
}
