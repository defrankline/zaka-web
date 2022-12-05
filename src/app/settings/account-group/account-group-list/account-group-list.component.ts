import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import Swal from 'sweetalert2';
import {AccountGroup} from '../account-group';
import {AccountGroupService} from '../account-group.service';
import {UntypedFormControl, Validators} from '@angular/forms';
import {AccountSubTypeService} from '../../account-sub-type/account-sub-type.service';
import {AccountSubType} from '../../account-sub-type/account-sub-type';
import {AccountGroupFormComponent} from '../account-group-form/account-group-form.component';
import {AccountTypeService} from '../../account-type/account-type.service';
import {AccountType} from '../../account-type/account-type';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {environment} from '../../../../environments/environment.prod';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {ToastService} from "../../../shared/services/toast.service";

@Component({
  selector: 'app-account-group-list',
  templateUrl: './account-group-list.component.html',
  styleUrls: ['./account-group-list.component.scss']
})
export class AccountGroupListComponent implements OnInit {

  public displayedColumns: string[] = ['id', 'code', 'newCode', 'name', 'balanceNature', 'type', 'subType', 'manage'];
  page: number;
  size: number;
  perPageOptions = [];
  totalItems: number;
  queryString: string;
  accountGroupListSubject: BehaviorSubject<AccountGroup[]> = new BehaviorSubject([]);
  accountTypes: any;
  accountSubTypes: any;
  accountSubTypeId: number;
  isLoading = false;
  accountTypeControl = new UntypedFormControl('', [Validators.required]);
  accountSubTypeControl = new UntypedFormControl('', [Validators.required]);
  memberControl = new UntypedFormControl('');

  constructor(
    private accountGroupService: AccountGroupService,
    private dialog: MatDialog,
    private toast: ToastService,
    private accountSubTypeService: AccountSubTypeService,
    private accountTypeService: AccountTypeService,
  ) {
    this.page = environment.page;
    this.size = environment.size;
    this.accountSubTypeId = 0;
    this.queryString = '_';
    this.perPageOptions = environment.perPageOptions;
  }

  ngOnInit(): void {
    this.loadData(this.page, this.size, this.queryString, this.accountSubTypeId);
    this.loadAccountTypes();
    this.filter();
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
    this.accountSubTypeId = accountSubType.id;
    this.loadData(this.page, this.size, this.queryString, accountSubType.id);
  }

  loadData(page: number, size: number, queryString: string, accountSubTypeId: number): void {
    this.accountGroupService.getAll(queryString, accountSubTypeId, page, size).subscribe((response) => {
      this.accountGroupListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getAccountGroups(): Observable<AccountGroup[]> {
    return this.accountGroupListSubject.asObservable();
  }

  create(): void {
    const data = {
      title: 'Create Account Group',
      action: 'create'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = data;
    const dl = this.dialog.open(AccountGroupFormComponent, dialogConfig);

    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        this.loadData(this.page, this.size, this.queryString, this.accountSubTypeId);
        this.toast.success('Success!','Account Group created successfully!');
      }
    });
  }

  edit(index: number, row: AccountGroup): void {
    const data = {
      title: 'Update LedgerAccount Group',
      action: 'update',
      accountGroup: row,
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = data;
    const dl = this.dialog.open(AccountGroupFormComponent, dialogConfig);
    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        this.loadData(this.page, this.size, this.queryString, this.accountSubTypeId);
        this.toast.success('Success!','LedgerAccount Group updated successfully!');
      }
    });
  }

  delete(index, row): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.accountGroupService.delete(row.id)
          .subscribe((response) => {
            this.loadData(this.page, this.size, this.queryString, this.accountSubTypeId);
            this.toast.success('Success!','Ledger Account Group deleted successfully!');
          });
      }
    });
  }

  filter(): void {
    this.memberControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(value => this.accountGroupService.getAll(value, this.accountSubTypeId, 0, 10)
          .pipe(finalize(() => (this.isLoading = false))))
      )
      .subscribe(response => {
        this.accountGroupListSubject.next(response.data.content);
        this.totalItems = response.data.totalElements;
      });
  }


  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    this.loadData(this.page, this.size, this.queryString, this.accountSubTypeId);
  }
}
