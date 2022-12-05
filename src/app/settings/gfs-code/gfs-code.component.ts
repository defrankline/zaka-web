import {Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {UntypedFormControl} from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';

import Swal from 'sweetalert2';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {GfsCode} from './gfs-code';
import {GfsCodeService} from './gfs-code.service';
import {FormComponent} from './form/form.component';
import {environment} from '../../../environments/environment.prod';
import {ToastService} from "../../shared/services/toast.service";

@Component({
  selector: 'app-gfs-code',
  templateUrl: './gfs-code.component.html',
  styleUrls: ['./gfs-code.component.scss']
})
export class GfsCodeComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'code', 'amount', 'accountName', 'accountNumber', 'paymentAccountName',
    'paymentAccountNumber', 'expenditureType', 'gfsCodeType', 'manage'];
  page: number;
  size: number;
  perPageOptions = [];
  totalItems: number;
  queryString: string;
  private itemListSubject: BehaviorSubject<GfsCode[]> = new BehaviorSubject(null);
  formResponseSubscription: Subscription;
  getAllPagedSubscription: Subscription;
  deleteSubscription: Subscription;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  searchControl = new UntypedFormControl('');
  isLoading = false;
  type = 'ALL';

  constructor(
    private gfsCodeService: GfsCodeService,
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
    this.getAllPagedSubscription = this.gfsCodeService.getAll(queryString, page, size).subscribe((response) => {
      this.itemListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getGfsCodes(): Observable<GfsCode[]> {
    return this.itemListSubject.asObservable();
  }

  form(row?: GfsCode): void {
    const data = {
      gfsCode: row ? row : undefined
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = data;
    const dl = this.dialog.open(FormComponent, dialogConfig);

    this.formResponseSubscription = dl.afterClosed().subscribe((response: any) => {
      if (response) {
        this.loadData(this.page, this.size, this.queryString);
        this.toast.success('Success!','Fund Source/Expense Item Saved successfully!');
      }
    });
  }

  delete(row: GfsCode): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.deleteSubscription = this.gfsCodeService.delete(row.id)
          .subscribe((response) => {
            this.loadData(this.page, this.size, this.queryString);
            this.toast.success('Success!','Fund Source/Expense Item deleted successfully!');
          });
      }
    });
  }


  filter(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(value => this.gfsCodeService.getAll(value, this.page, this.size)
          .pipe(finalize(() => (this.isLoading = false))))
      )
      .subscribe(response => {
        this.itemListSubject.next(response.data.content);
        this.totalItems = response.data.totalElements;
      });
  }

  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    this.loadData(this.page, this.size, this.queryString);
  }

  publish(index: number, gfsCode: GfsCode): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Publish it!'
    }).then(result => {
      if (result.value) {
        this.deleteSubscription = this.gfsCodeService.publish(gfsCode.id)
          .subscribe((response) => {
            this.toast.success('Success!','Fund Source Published Successfully!');
          });
      }
    });
  }

  sync(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, synchronize it!'
    }).then(result => {
      if (result.value) {
        this.gfsCodeService.sync()
          .subscribe((response) => {
            this.loadData(this.page, this.size, this.queryString);
            this.toast.success('Success!','Fund Sources & Expense Items Synchronized Successfully!');
          });
      }
    });
  }
}
