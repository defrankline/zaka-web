import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Loan} from '../../loan-management/loan/loan';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {LoanUsage} from '../../loan-management/loan/loan-usage/loan-usage';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {LoanUsageService} from '../../loan-management/loan/loan-usage/loan-usage.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {ApiConfig} from '../api.config';

@Component({
  selector: 'app-view-loan-usage-list',
  templateUrl: './view-loan-usage-list.component.html',
  styleUrls: ['./view-loan-usage-list.component.scss']
})
export class ViewLoanUsageListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'area', 'amount'];
  page: number;
  size: number;
  perPageOptions = [];
  totalItems: number;
  loan: Loan;
  title: string;
  loanUsageListSubject: BehaviorSubject<LoanUsage[]> = new BehaviorSubject(null);
  formResponseSubscription: Subscription;
  getAllPagedSubscription: Subscription;
  deleteSubscription: Subscription;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private loanUsageService: LoanUsageService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ViewLoanUsageListComponent>,
    private toast: ToastrService,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.page = ApiConfig.page;
    this.size = ApiConfig.size;
    this.title = data.title;
    this.loan = data.loan;
    this.perPageOptions = ApiConfig.perPageOptions;
  }

  ngOnInit(): void {
    this.loadData(this.page, this.size, this.loan.id);
  }

  loadData(page: number, size: number, loanId: number) {
    this.getAllPagedSubscription = this.loanUsageService.getAllPaged(page, size, loanId).subscribe((response) => {
      this.loanUsageListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getLoanUsageList(): Observable<LoanUsage[]> {
    return this.loanUsageListSubject.asObservable();
  }

  getTotalAmount() {
    const items = this.loanUsageListSubject.getValue();
    return items.map(t => t.amount).reduce((acc, value) => acc + value, 0);
  }

  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    this.loadData(this.page, this.size, this.loan.id);
  }

}
