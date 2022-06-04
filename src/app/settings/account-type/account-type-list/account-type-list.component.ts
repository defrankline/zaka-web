import {Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import Swal from 'sweetalert2';
import {AccountType} from '../account-type';
import {AccountTypeService} from '../account-type.service';
import {AccountTypeFormComponent} from '../account-type-form/account-type-form.component';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {environment} from '../../../../environments/environment.prod';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {ToastService} from "../../../shared/services/toast.service";

@Component({
  selector: 'app-account-type-list',
  templateUrl: './account-type-list.component.html',
  styleUrls: ['./account-type-list.component.scss']
})
export class AccountTypeListComponent implements OnInit {

  public displayedColumns: string[] = ['id', 'code', 'name', 'balanceNature', 'manage'];
  page: number;
  size: number;
  perPageOptions = [];
  totalItems: number;
  data: any;
  queryString: string;
  private accountTypeListSubject: BehaviorSubject<AccountType[]> = new BehaviorSubject(null);
  searchControl = new FormControl('');

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  private isLoading = false;

  constructor(
    private accountTypeService: AccountTypeService,
    private dialog: MatDialog,
    private toast: ToastService
  ) {
    this.page = environment.page;
    this.size = environment.size;
    this.queryString = '_';
    this.perPageOptions = environment.perPageOptions;
  }

  ngOnInit(): void {
    this.loadData(this.page, this.size, this.queryString);
    this.filter();
  }

  loadData(page: number, size: number, queryString: string): void {
    this.accountTypeService.getAll(queryString, page, size).subscribe((response) => {
      this.accountTypeListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getAccountTypes(): Observable<AccountType[]> {
    return this.accountTypeListSubject.asObservable();
  }

  create(): void {
    this.data = {
      title: 'Create Ledger Account Type',
      action: 'create'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = this.data;
    const dl = this.dialog.open(AccountTypeFormComponent, dialogConfig);

    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        const items = this.accountTypeListSubject.getValue();
        items.push(response.data);
        this.toast.success('Success!','AccountType created successfully!');
      }
    });
  }

  edit(index: number, row: AccountType): void {
    this.data = {
      title: 'Update Ledger Account Type',
      action: 'update',
      accountType: row,
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = this.data;
    const dl = this.dialog.open(AccountTypeFormComponent, dialogConfig);
    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        const items = this.accountTypeListSubject.getValue();
        items[index] = response.data;
        this.toast.success('Success!','Ledger Account Type updated successfully!');
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
        this.accountTypeService.delete(row.id)
          .subscribe((response) => {
            const items = this.accountTypeListSubject.getValue();
            items.splice(index, 1);
            this.toast.success('Success!','Ledger Account Type deleted successfully!');
          });
      }
    });
  }


  filter(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(value => this.accountTypeService.getAll(value, this.page, this.size)
          .pipe(finalize(() => (this.isLoading = false))))
      )
      .subscribe(response => {
        this.accountTypeListSubject.next(response.data.content);
        this.totalItems = response.data.totalElements;
      });
  }


  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    this.loadData(this.page, this.size, this.queryString);
  }
}
