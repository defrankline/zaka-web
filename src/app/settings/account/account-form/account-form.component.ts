import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {AccountService} from '../account.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AccountGroup} from '../../account-group/account-group';
import {AccountSubTypeService} from '../../account-sub-type/account-sub-type.service';
import {AccountGroupService} from '../../account-group/account-group.service';
import {AccountTypeService} from '../../account-type/account-type.service';
import {AccountType} from '../../account-type/account-type';
import {AccountSubType} from '../../account-sub-type/account-sub-type';
import {ToastService} from "../../../shared/services/toast.service";

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss']
})
export class AccountFormComponent implements OnInit {

  public loading: boolean;
  action: string;
  title: string;
  formGroup: UntypedFormGroup;
  account: any;
  storeSubscription: Subscription;
  accountTypes: any;
  accountSubTypes: any;
  accountGroups: any;

  constructor(
    private accountService: AccountService,
    private accountGroupService: AccountGroupService,
    private accountSubTypeService: AccountSubTypeService,
    private accountTypeService: AccountTypeService,
    private dialogRef: MatDialogRef<AccountFormComponent>,
    private toast: ToastService,
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.loading = false;
    this.action = data.action;
    this.title = data.title;
    if (this.action === 'update') {
      this.account = data.account;
      this.loadAccountGroups(this.account.accountGroup.accountSubType);
      this.loadAccountSubTypes(this.account.accountGroup.accountSubType.accountType);
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
      this.toast.success('Success!','LedgerAccount Type could not be loaded!');
    });
  }

  loadAccountSubTypes(accountType: AccountType): void {
    this.accountSubTypeService.getAll('_', accountType.id).subscribe((response) => {
      this.accountSubTypes = response.data;
    }, error => {
      this.toast.success('Success!','LedgerAccount Sub-Type could not be loaded!');
    });
  }

  loadAccountGroups(accountSubType: AccountSubType): void {
    this.accountGroupService.getAll('_', accountSubType.id).subscribe((response) => {
      this.accountGroups = response.data;
    }, error => {
      this.toast.success('Success!','LedgerAccount Groups could not be loaded!');
    });
  }

  initFormGroup(): UntypedFormGroup {
    if (this.action === 'create') {
      return this.formBuilder.group({
        name: ['', Validators.required],
        accountGroup: ['', Validators.required],
        accountSubType: ['', Validators.required],
        accountType: ['', Validators.required],
        /*overdraft: [false, Validators.required],*/
       /* balance: [0, [Validators.required, Validators.min(0)]],*/
        number: ['', [Validators.required]],
      });
    } else {
      return this.formBuilder.group({
        id: [this.account.id, Validators.required],
        name: [this.account.name, Validators.required],
        accountGroup: [this.account.accountGroup, Validators.required],
        accountSubType: [this.account.accountGroup.accountSubType, Validators.required],
        accountType: [this.account.accountGroup.accountSubType.accountType, Validators.required],
        /*overdraft: [this.account.overdraft, Validators.required],*/
        /*balance: [this.account.balance, [Validators.required, Validators.min(0)]],*/
        number: [this.account.number, [
          Validators.required]
        ],
      });
    }
  }


  store(account): void {
    if (this.action === 'create') {
      this.loading = true;
      this.storeSubscription = this.accountService.store(account)
        .pipe(finalize(() => this.loading = false))
        .subscribe(response => {
          this.dialogRef.close(response);
        }, error => {
          this.toast.success('Success!',error.error.message);
        });
    } else {
      this.loading = true;
      this.storeSubscription = this.accountService.update(account)
        .pipe(finalize(() => this.loading = false))
        .subscribe(response => {
          this.dialogRef.close(response);
        }, error => {
          this.toast.success('Success!','LedgerAccount could not be updated!');
        });
    }
  }

  trackAccountTypeId(index: number, item: AccountType): number {
    return item.id;
  }

  trackAccountSubTypeId(index: number, item: AccountSubType): number {
    return item.id;
  }

  trackAccountGroupId(index: number, item: AccountGroup): number {
    return item.id;
  }

  close(): void {
    this.dialogRef.close();
  }
}
