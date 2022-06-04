import {Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import Swal from 'sweetalert2';
import {AccountService} from '../account.service';
import {AccountFormComponent} from '../account-form/account-form.component';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {LedgerAccount} from '../ledger-account';
import {FormControl, Validators} from '@angular/forms';
import {AccountGroup} from '../../account-group/account-group';
import {AccountSubTypeService} from '../../account-sub-type/account-sub-type.service';
import {AccountGroupService} from '../../account-group/account-group.service';
import {AccountTypeService} from '../../account-type/account-type.service';
import {AccountType} from '../../account-type/account-type';
import {AccountSubType} from '../../account-sub-type/account-sub-type';
import {environment} from '../../../../environments/environment.prod';
import {ToastService} from "../../../shared/services/toast.service";


@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit {

  public displayedColumns: string[] = ['id', 'number', 'name', 'type', 'subType', 'group', 'balance', 'manage'];
  page: number;
  size: number;
  perPageOptions = [];
  totalItems: number;
  data: any;
  queryString: string;
  accountListSubject: BehaviorSubject<LedgerAccount[]> = new BehaviorSubject(null);

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  accountTypes: any;
  accountSubTypes: any;
  accountGroups: AccountGroup[] = [];
  accountGroupId: number;
  accountGroup: AccountGroup;
  accountType: AccountType;
  accountSubType: AccountSubType;
  isLoading = false;

  accountTypeControl = new FormControl('', [Validators.required]);
  accountSubTypeControl = new FormControl('', [Validators.required]);
  accountGroupControl = new FormControl('', [Validators.required]);

  constructor(
    private accountService: AccountService,
    private accountGroupService: AccountGroupService,
    private accountSubTypeService: AccountSubTypeService,
    private accountTypeService: AccountTypeService,
    private dialog: MatDialog,
    private toast: ToastService
  ) {
    this.page = environment.page;
    this.size = environment.size;
    this.queryString = '_';
    this.accountGroupId = 0;
    this.perPageOptions = environment.perPageOptions;
  }

  ngOnInit(): void {
    this.loadData(this.page, this.size, this.queryString, this.accountGroupId);
    this.loadAccountTypes();
  }


  loadAccountTypes(): void {
    this.accountTypeService.getAll().subscribe((response) => {
      this.accountTypes = response.data;
    }, error => {
      this.toast.success('Success!','LedgerAccount Type could not be loaded!');
    });
  }

  loadAccountSubTypes(accountType: AccountType): void {
    this.accountType = accountType;
    this.loadDataByTypeId(this.page, this.size, this.queryString, this.accountType.id);
  }

  loadAccountGroups(accountSubType: AccountSubType): void {
    this.accountSubType = accountSubType;
    this.loadDataBySubTypeId(this.page, this.size, this.queryString, this.accountSubType.id);
  }

  loadAccounts(accountGroup: AccountGroup): void {
    this.accountGroup = accountGroup;
    this.loadData(this.page, this.size, this.queryString, this.accountGroup.id);
  }

  loadData(page: number, size: number, queryString: string, accountGroupId: number): void {
    this.accountService.getAll(queryString, accountGroupId, page, size).subscribe((response) => {
      this.accountListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  loadDataByTypeId(page: number, size: number, queryString: string, typeId: number): void {
    this.accountService.getAllPagedByAccountTypeId(page, size, queryString, typeId).subscribe((response) => {
      this.accountListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
      this.accountSubTypeService.getAll('_', typeId).subscribe((res) => {
        this.accountSubTypes = res.data;
      });
    });
  }

  loadDataBySubTypeId(page: number, size: number, queryString: string, subTypeId: number): void {
    this.accountService.getAllPagedByAccountSubTypeId(queryString, subTypeId, page, size).subscribe((response) => {
      this.accountListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
      this.accountGroupService.getAll('_', subTypeId).subscribe((res) => {
        this.accountGroups = res.data;
      });
    });
  }

  getAccounts(): Observable<LedgerAccount[]> {
    return this.accountListSubject.asObservable();
  }

  create(): void {
    this.data = {
      title: 'Create LedgerAccount ',
      action: 'create'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = this.data;
    const dl = this.dialog.open(AccountFormComponent, dialogConfig);

    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        const items = this.accountListSubject.getValue();
        items.push(response.data);
        this.toast.success('Success!','LedgerAccount created successfully!');
      }
    });
  }

  edit(index: number, item: LedgerAccount): void {
    this.data = {
      title: 'Update LedgerAccount ',
      action: 'update',
      account: item,
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = this.data;
    const dl = this.dialog.open(AccountFormComponent, dialogConfig);
    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        const items = this.accountListSubject.getValue();
        items[index] = response.data;
        this.toast.success('Success!','LedgerAccount  updated successfully!');
      }
    });
  }

  delete(index: number, row: LedgerAccount): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!', showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.accountService.delete(row.id)
          .subscribe((response) => {
            const items = this.accountListSubject.getValue();
            items.splice(index, 1);
            this.toast.success('Success!','LedgerAccount  deleted successfully!');
          });
      }
    });
  }


  filter(query: string): void {
    this.queryString = query;
    if (query.length > 2 || query.length === 0) {
      this.loadData(this.page, this.size, this.queryString, this.accountGroupId);
    }
  }


  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    if (this.accountType && this.accountSubType && this.accountGroup) {
      this.loadData(this.page, this.size, this.queryString, this.accountGroup.id);
    } else if (this.accountType && this.accountSubType && !this.accountGroup) {
      this.loadDataBySubTypeId(this.page, this.size, this.queryString, this.accountSubType.id);
    } else if (this.accountType && !this.accountSubType && !this.accountGroup) {
      this.loadDataByTypeId(this.page, this.size, this.queryString, this.accountType.id);
    } else {
      this.loadData(this.page, this.size, this.queryString, this.accountGroupId);
    }
  }
}
