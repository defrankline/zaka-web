import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Loan} from '../../loan-management/loan/loan';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {LoanRepayment} from '../../loan-management/loan/loan-repayment/loan-repayment';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {LoanRepaymentService} from '../../loan-management/loan/loan-repayment/loan-repayment.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {ApiConfig} from '../api.config';

@Component({
  selector: 'app-view-loan-repayment-schedule-list',
  templateUrl: './view-loan-repayment-schedule-list.component.html',
  styleUrls: ['./view-loan-repayment-schedule-list.component.scss']
})
export class ViewLoanRepaymentScheduleListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'month', 'amount', 'principal', 'principalPaid', 'interest', 'interestPaid', /*'balance',*/ 'status'];
  page: number;
  size: number;
  perPageOptions = [];
  totalItems: number;
  loan: Loan;
  title: string;
  loanRepaymentListSubject: BehaviorSubject<LoanRepayment[]> = new BehaviorSubject(null);
  formResponseSubscription: Subscription;
  getAllPagedSubscription: Subscription;
  deleteSubscription: Subscription;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private loanRepaymentService: LoanRepaymentService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ViewLoanRepaymentScheduleListComponent>,
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

  loadData(page: number, size: number, loanId: number): void {
    this.getAllPagedSubscription = this.loanRepaymentService.getAllPaged(page, size, loanId).subscribe((response) => {
      this.loanRepaymentListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getLoanRepayments(): Observable<LoanRepayment[]> {
    return this.loanRepaymentListSubject.asObservable();
  }

  getTotalAmount(): number {
    const items = this.loanRepaymentListSubject.getValue();
    return items.map(t => t.amount).reduce((acc, value) => acc + value, 0);
  }

  getTotalPrincipal(): number {
    const items = this.loanRepaymentListSubject.getValue();
    return items.map(t => t.principal).reduce((acc, value) => acc + value, 0);
  }

  getTotalInterest(): number {
    const items = this.loanRepaymentListSubject.getValue();
    return items.map(t => t.interest).reduce((acc, value) => acc + value, 0);
  }

  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    this.loadData(this.page, this.size, this.loan.id);
  }

  getTotalPrincipalPaid(): number {
    const items = this.loanRepaymentListSubject.getValue();
    return items.map(t => t.principalPaid).reduce((acc, value) => acc + value, 0);
  }

  getTotalInterestPaid(): number {
    const items = this.loanRepaymentListSubject.getValue();
    return items.map(t => t.interestPaid).reduce((acc, value) => acc + value, 0);
  }
}
