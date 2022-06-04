import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {AccountGroup} from '../account-group';
import {AccountGroupService} from '../account-group.service';
import {AccountSubTypeService} from '../../account-sub-type/account-sub-type.service';
import {AccountSubType} from '../../account-sub-type/account-sub-type';
import {AccountTypeService} from '../../account-type/account-type.service';
import {AccountType} from '../../account-type/account-type';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastService} from '../../../utils/toast/toast.service';

@Component({
  selector: 'app-account-group-form',
  templateUrl: './account-group-form.component.html',
  styleUrls: ['./account-group-form.component.scss']
})
export class AccountGroupFormComponent implements OnInit {

  public loading: boolean;
  action: string;
  title: string;
  formGroup: FormGroup;
  accountGroup: AccountGroup;
  storeSubscription: Subscription;
  accountTypes: any;
  accountSubTypes: any;
  balanceNatureList: any;

  constructor(
    private accountGroupService: AccountGroupService,
    private accountSubTypeService: AccountSubTypeService,
    private accountTypeService: AccountTypeService,
    private dialogRef: MatDialogRef<AccountGroupFormComponent>,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.loading = false;
    this.action = data.action;
    this.title = data.title;
    if (this.action === 'update') {
      this.accountGroup = data.accountGroup;
      this.loadAccountSubTypes(this.accountGroup.accountSubType.accountType);
    }
  }

  ngOnInit(): void {
    this.balanceNatureList = this.accountTypeService.balanceNatureList();
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

  loadAccountSubTypes(accountType: AccountType): void {
    this.accountSubTypeService.getAll('_', accountType.id).subscribe((response) => {
      this.accountSubTypes = response.data;
    }, error => {
      this.toast.show('LedgerAccount Sub-Type could not be loaded!');
    });
  }

  initFormGroup(): FormGroup {
    if (this.action === 'create') {
      return this.formBuilder.group({
        name: ['', Validators.required],
        accountType: ['', Validators.required],
        accountSubType: ['', Validators.required],
        balanceNature: ['', Validators.required],
        code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
        newCode: ['', [Validators.required]],
      });
    } else {
      return this.formBuilder.group({
        id: [this.accountGroup.id, Validators.required],
        name: [this.accountGroup.name, Validators.required],
        balanceNature: [this.accountGroup.balanceNature, Validators.required],
        accountType: [this.accountGroup.accountSubType.accountType, Validators.required],
        accountSubType: [this.accountGroup.accountSubType, Validators.required],
        code: [this.accountGroup.code, [Validators.required]],
        newCode: [this.accountGroup.newCode, [Validators.required]],
      });
    }
  }


  store(accountGroup: AccountGroup): void {
    if (this.action === 'create') {
      this.loading = true;
      this.storeSubscription = this.accountGroupService.store(accountGroup)
        .pipe(finalize(() => this.loading = false))
        .subscribe(response => {
          this.dialogRef.close(response);
        }, error => {
          this.toast.show(error.error.message);
        });
    } else {
      this.loading = true;
      this.storeSubscription = this.accountGroupService.update(accountGroup)
        .pipe(finalize(() => this.loading = false))
        .subscribe(response => {
          this.dialogRef.close(response);
        }, error => {
          this.toast.show('Account Group could not be updated!');
        });
    }
  }

  trackAccountTypeId(index: number, item: AccountType): number {
    return item.id;
  }

  trackAccountSubTypeId(index: number, item: AccountSubType): number {
    return item.id;
  }

  close(): void {
    this.dialogRef.close();
  }
}
