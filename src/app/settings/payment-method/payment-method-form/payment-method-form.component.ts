import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {PaymentMethod} from '../payment-method';
import {PaymentMethodService} from '../payment-method.service';
import {LedgerAccount} from '../../account/ledger-account';
import {AccountService} from '../../account/account.service';
import {ToastService} from '../../../utils/toast/toast.service';

@Component({
  selector: 'app-payment-method-form',
  templateUrl: './payment-method-form.component.html',
  styleUrls: ['./payment-method-form.component.scss']
})
export class PaymentMethodFormComponent implements OnInit {

  public loading: boolean;
  isLoading = false;
  formGroup: FormGroup;
  paymentMethod?: PaymentMethod;
  accountControl = new FormControl('');
  accounts: LedgerAccount[];

  constructor(
    private paymentMethodService: PaymentMethodService,
    private accountService: AccountService,
    private dialogRef: MatDialogRef<PaymentMethodFormComponent>,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.loading = false;
    if (data.paymentMethod !== undefined) {
      this.paymentMethod = data.paymentMethod;
      this.accountControl.setValue(this.paymentMethod.account);
    }
  }

  ngOnInit(): void {
    this.formGroup = this.initFormGroup();
    this.loadAccounts();
  }

  close(): void {
    this.dialogRef.close();
  }

  loadAccounts(): void {
    this.accountControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(value => this.accountService.getAll(value, 0, 0, 10)
          .pipe(finalize(() => (this.isLoading = false))))
      )
      .subscribe(response => {
        this.accounts = response.data.content;
      });
  }

  displayAccount(user: LedgerAccount): string {
    if (user) {
      return user.number + ' - ' + user.name;
    } else {
      return '';
    }
  }


  initFormGroup(): FormGroup {
    if (this.paymentMethod === undefined) {
      return this.formBuilder.group({
        name: ['', Validators.required],
        code: ['', [Validators.required]],
      });
    } else {
      return this.formBuilder.group({
        id: [this.paymentMethod.id, Validators.required],
        name: [this.paymentMethod.name, Validators.required],
        code: [this.paymentMethod.code, [Validators.required]],
      });
    }
  }


  store(paymentMethod: PaymentMethod) {
    paymentMethod.account = this.accountControl.value as LedgerAccount;
    if (this.paymentMethod === undefined) {
      this.loading = true;
      this.paymentMethodService.store(paymentMethod)
        .pipe(finalize(() => this.loading = false))
        .subscribe(response => {
          this.dialogRef.close(response);
        });
    } else {
      this.loading = true;
      this.paymentMethodService.update(paymentMethod)
        .pipe(finalize(() => this.loading = false))
        .subscribe(response => {
          this.dialogRef.close(response);
        }, error => {
          this.toast.show('Payment Method could not be updated!');
        });
    }
  }
}
