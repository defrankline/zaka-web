import {Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';

import Swal from 'sweetalert2';
import {PaymentMethod} from '../payment-method';
import {PaymentMethodService} from '../payment-method.service';
import {PaymentMethodFormComponent} from '../payment-method-form';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {environment} from '../../../../environments/environment.prod';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {UntypedFormControl} from '@angular/forms';
import {ToastService} from "../../../shared/services/toast.service";

@Component({
  selector: 'app-payment-method-list',
  templateUrl: './payment-method-list.component.html',
  styleUrls: ['./payment-method-list.component.scss']
})
export class PaymentMethodListComponent implements OnInit {

  public displayedColumns: string[] = ['id', 'name', 'code', 'account', 'manage'];
  page: number;
  size: number;
  perPageOptions = [];
  totalItems: number;
  isLoading = false;
  queryString: string;
  paymentMethodListSubject: BehaviorSubject<PaymentMethod[]> = new BehaviorSubject(null);
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  searchControl = new UntypedFormControl('');

  constructor(
    private paymentMethodService: PaymentMethodService,
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
    this.paymentMethodService.getAll(queryString, page, size).subscribe((response) => {
      this.paymentMethodListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getPaymentMethods(): Observable<PaymentMethod[]> {
    return this.paymentMethodListSubject.asObservable();
  }

  form(row?: PaymentMethod): void {
    const data = {
      paymentMethod: row ? row : undefined
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = data;
    const dl = this.dialog.open(PaymentMethodFormComponent, dialogConfig);
    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        this.loadData(this.page, this.size, this.queryString);
        this.toast.success('Success!','Payment Method created successfully!');
      }
    });
  }

  delete(row: PaymentMethod): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.paymentMethodService.delete(row.id)
          .subscribe((response) => {
            this.loadData(this.page, this.size, this.queryString);
            this.toast.success('Success!','Payment Method deleted successfully!');
          });
      }
    });
  }


  filter(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(value => this.paymentMethodService.getAll(value, this.page, this.size)
          .pipe(finalize(() => (this.isLoading = false))))
      )
      .subscribe(response => {
        this.paymentMethodListSubject.next(response.data.content);
        this.totalItems = response.data.totalElements;
      });
  }


  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    this.loadData(this.page, this.size, this.queryString);
  }
}
