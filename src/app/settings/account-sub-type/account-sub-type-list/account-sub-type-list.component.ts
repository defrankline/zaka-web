import {Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';

import Swal from 'sweetalert2';
import {AccountSubType} from '../account-sub-type';
import {AccountSubTypeService} from '../account-sub-type.service';
import {AccountSubTypeFormComponent} from '../account-sub-type-form';
import {FormControl, Validators} from '@angular/forms';
import {AccountTypeService} from '../../account-type/account-type.service';
import {AccountType} from '../../account-type/account-type';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {environment} from '../../../../environments/environment.prod';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {ToastService} from "../../../shared/services/toast.service";

@Component({
  selector: 'app-account-sub-type-list',
  templateUrl: './account-sub-type-list.component.html',
  styleUrls: ['./account-sub-type-list.component.scss']
})
export class AccountSubTypeListComponent implements OnInit {

  public displayedColumns: string[] = ['id', 'code', 'name', 'type', 'manage'];
  page: number;
  size: number;
  perPageOptions = [];
  totalItems: number;
  searchControl = new FormControl();
  data: any;
  queryString: string;
  private accountSubTypeListSubject: BehaviorSubject<AccountSubType[]> = new BehaviorSubject(null);
  formResponseSubscription: Subscription;
  getAllPagedSubscription: Subscription;
  deleteSubscription: Subscription;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  isLoading = false;
  accountTypes: any;
  accountTypeId: number;

  accountTypeControl = new FormControl('', [Validators.required]);

  constructor(
    private accountSubTypeService: AccountSubTypeService,
    private dialog: MatDialog,
    private toast: ToastService,
    private accountTypeService: AccountTypeService,
  ) {
    this.page = environment.page;
    this.size = environment.size;
    this.accountTypeId = 0;
    this.queryString = '_';
    this.perPageOptions = environment.perPageOptions;
  }

  ngOnInit(): void {
    this.loadData(this.page, this.size, this.queryString, this.accountTypeId);
    this.loadAccountTypes();
    this.filter();
  }

  loadAccountTypes(): void {
    this.accountTypeService.getAll().subscribe((response) => {
      this.accountTypes = response.data;
    }, error => {
      this.toast.success('Success!','Ledger Account Type could not be loaded!');
    });
  }

  filter(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(value => this.accountSubTypeService.getAll(value, this.accountTypeId, this.page, this.size)
          .pipe(finalize(() => (this.isLoading = false))))
      )
      .subscribe(response => {
        this.accountSubTypeListSubject.next(response.data.content);
        this.totalItems = response.data.totalElements;
      });
  }

  loadAccountSubTypes(accountType: AccountType): void {
    this.loadData(this.page, this.size, this.queryString, accountType.id);
  }


  loadData(page: number, size: number, queryString: string, accountTypeId: number): void {
    this.getAllPagedSubscription = this.accountSubTypeService.getAll(queryString, accountTypeId, page, size).subscribe((response) => {
      this.accountSubTypeListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getAccountSubTypes(): Observable<AccountSubType[]> {
    return this.accountSubTypeListSubject.asObservable();
  }

  create(): void {
    this.data = {
      title: 'Create LedgerAccount Sub-Type',
      action: 'create'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = this.data;
    const dl = this.dialog.open(AccountSubTypeFormComponent, dialogConfig);

    this.formResponseSubscription = dl.afterClosed().subscribe((response: any) => {
      if (response) {
        const items = this.accountSubTypeListSubject.getValue();
        items.push(response.data);
        this.toast.success('Success!','LedgerAccount Sub-Type created successfully!');
      }
    });
  }

  edit(index: number, row: AccountSubType): void {
    this.data = {
      title: 'Update LedgerAccount Sub-Type',
      action: 'update',
      accountSubType: row,
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = this.data;
    const dl = this.dialog.open(AccountSubTypeFormComponent, dialogConfig);
    this.formResponseSubscription = dl.afterClosed().subscribe((response: any) => {
      if (response) {
        const items = this.accountSubTypeListSubject.getValue();
        items[index] = response.data;
        this.toast.success('Success!','LedgerAccount Sub-Type updated successfully!');
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
        this.deleteSubscription = this.accountSubTypeService.delete(row.id)
          .subscribe((response) => {
            const items = this.accountSubTypeListSubject.getValue();
            items.splice(index, 1);
            this.toast.success('Success!','LedgerAccount Sub-Type deleted successfully!');
          });
      }
    });
  }

  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    this.loadData(this.page, this.size, this.queryString, this.accountTypeId);
  }
}
