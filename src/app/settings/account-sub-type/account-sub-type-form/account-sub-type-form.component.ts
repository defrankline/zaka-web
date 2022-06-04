import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {AccountSubType} from '../account-sub-type';
import {AccountSubTypeService} from '../account-sub-type.service';
import {AccountTypeService} from '../../account-type/account-type.service';
import {AccountType} from '../../account-type/account-type';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastService} from '../../../utils/toast/toast.service';

@Component({
  selector: 'app-account-sub-type-form',
  templateUrl: './account-sub-type-form.component.html',
  styleUrls: ['./account-sub-type-form.component.scss']
})
export class AccountSubTypeFormComponent implements OnInit, OnDestroy {

  public loading: boolean;
  action: string;
  title: string;
  formGroup: FormGroup;
  accountSubType: AccountSubType;
  storeSubscription: Subscription;
  accountTypes: any;

  constructor(
    private accountSubTypeService: AccountSubTypeService,
    private accountTypeService: AccountTypeService,
    private dialogRef: MatDialogRef<AccountSubTypeFormComponent>,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.loading = false;
    this.action = data.action;
    this.title = data.title;
    if (this.action === 'update') {
      this.accountSubType = data.accountSubType;
    }
  }

  ngOnInit(): void {
    this.loadAccountTypes();
    this.formGroup = this.initFormGroup();
  }

  loadAccountTypes(): void {
    this.accountTypeService.getAll().subscribe((response) => {
      this.accountTypes = response.data;
    }, error => {
      this.toast.show('LedgerAccount Type could not be loaded!');
    });
  }

  initFormGroup(): FormGroup {
    if (this.action === 'create') {
      return this.formBuilder.group({
        name: ['', Validators.required],
        accountType: ['', Validators.required],
        code: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      });
    } else {
      return this.formBuilder.group({
        id: [this.accountSubType.id, Validators.required],
        name: [this.accountSubType.name, Validators.required],
        accountType: [this.accountSubType.accountType, Validators.required],
        code: [this.accountSubType.code, [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(3)]
        ],
      });
    }
  }


  store(accountSubType: AccountSubType): void {
    if (this.action === 'create') {
      this.loading = true;
      this.storeSubscription = this.accountSubTypeService.store(accountSubType)
        .pipe(finalize(() => this.loading = false))
        .subscribe(response => {
          this.dialogRef.close(response);
        }, error => {
          this.toast.show(error.error.message);
        });
    } else {
      this.loading = true;
      this.storeSubscription = this.accountSubTypeService.update(accountSubType)
        .pipe(finalize(() => this.loading = false))
        .subscribe(response => {
          this.dialogRef.close(response);
        }, error => {

          this.toast.show('LedgerAccount SubType could not be updated!');
        });
    }
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }

  trackAccountTypeId(index: number, item: AccountType): number {
    return item.id;
  }
}
