import {Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import Swal from 'sweetalert2';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {DefaultAccount} from '../default-account';
import {DefaultAccountService} from '../default-account.service';
import {FormComponent} from '../form/form.component';
import {environment} from '../../../../environments/environment.prod';
import {ToastService} from '../../../utils/toast/toast.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'key', 'accountName', 'accountNumber', 'manage'];
  page: number;
  size: number;
  perPageOptions = [];
  totalItems: number;
  data: any;
  queryString: string;
  private defaultAccountListSubject: BehaviorSubject<DefaultAccount[]> = new BehaviorSubject(null);
  formResponseSubscription: Subscription;
  getAllPagedSubscription: Subscription;
  deleteSubscription: Subscription;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private defaultAccountService: DefaultAccountService,
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
  }

  loadData(page: number, size: number, queryString: string): void {
    this.getAllPagedSubscription = this.defaultAccountService.getAll(queryString, page, size).subscribe((response) => {
      this.defaultAccountListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getDefaultAccounts(): Observable<DefaultAccount[]> {
    return this.defaultAccountListSubject.asObservable();
  }

  create(): void {
    this.data = {
      title: 'Set LedgerAccount',
      action: 'create'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = this.data;
    const dl = this.dialog.open(FormComponent, dialogConfig);

    this.formResponseSubscription = dl.afterClosed().subscribe((response: any) => {
      if (response) {
        const items = this.defaultAccountListSubject.getValue();
        items.push(response.data);
        this.toast.show('Default LedgerAccount set successfully!');
      }
    });
  }

  edit(index: number, defaultAccount: DefaultAccount): void {
    this.data = {
      title: 'Update Set LedgerAccount',
      action: 'update',
      defaultAccount,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = this.data;
    const dl = this.dialog.open(FormComponent, dialogConfig);
    this.formResponseSubscription = dl.afterClosed().subscribe((response: any) => {
      if (response) {
        const items = this.defaultAccountListSubject.getValue();
        items[index] = response.data;
        this.toast.show('DefaultAccount updated successfully!');
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
        this.deleteSubscription = this.defaultAccountService.delete(row.id)
          .subscribe((response) => {
            const items = this.defaultAccountListSubject.getValue();
            items.splice(index, 1);
            this.toast.show('Default LedgerAccount removed successfully!');
          });
      }
    });
  }


  filter(query: string): void {
    this.queryString = query;
    if (query.length > 2 || query.length === 0) {
      this.loadData(this.page, this.size, this.queryString);
    }
  }

  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    this.loadData(this.page, this.size, this.queryString);
  }
}
