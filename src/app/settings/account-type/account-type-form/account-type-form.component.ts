import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

import {finalize} from 'rxjs/operators';
import {AccountType} from '../account-type';
import {AccountTypeService} from '../account-type.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastService} from "../../../shared/services/toast.service";

@Component({
  selector: 'app-account-type-form',
  templateUrl: './account-type-form.component.html',
  styleUrls: ['./account-type-form.component.scss']
})
export class AccountTypeFormComponent implements OnInit, OnDestroy {

  loading: boolean;
  action: string;
  title: string;
  formGroup: FormGroup;
  accountType: AccountType;
  storeSubscription: Subscription;
  balanceNatureList: any;

  constructor(
    private accountTypeService: AccountTypeService,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AccountTypeFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.loading = false;
    this.action = data.action;
    this.title = data.title;
    if (this.action === 'update') {
      this.accountType = data.accountType;
    }
  }

  ngOnInit(): void {
    this.balanceNatureList = this.accountTypeService.balanceNatureList();
    this.formGroup = this.initFormGroup();
  }

  initFormGroup(): FormGroup {
    if (this.action === 'create') {
      return this.formBuilder.group({
        name: ['', Validators.required],
        balanceNature: ['', Validators.required],
        code: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      });
    } else {
      return this.formBuilder.group({
        id: [this.accountType.id, Validators.required],
        name: [this.accountType.name, Validators.required],
        balanceNature: [this.accountType.balanceNature, Validators.required],
        code: [this.accountType.code, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(2)]
        ],
      });
    }
  }


  store(accountType: AccountType): void {
    if (this.action === 'create') {
      this.loading = true;
      this.storeSubscription = this.accountTypeService.store(accountType)
        .pipe(finalize(() => this.loading = false))
        .subscribe(response => {
          this.dialogRef.close(response);
        }, error => {
          this.toast.success('Success!',error.error.message);
        });
    } else {
      this.loading = true;
      this.storeSubscription = this.accountTypeService.update(accountType)
        .pipe(finalize(() => this.loading = false))
        .subscribe(response => {
          this.dialogRef.close(response);
        }, error => {
          this.toast.success('Success!','Ledger Account Type could not be updated!');
        });
    }
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }

}
