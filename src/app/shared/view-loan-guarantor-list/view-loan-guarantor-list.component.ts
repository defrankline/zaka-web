import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Loan} from '../../loan-management/loan/loan';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {LoanGuarantor} from '../../loan-management/loan/loan-guarantor/loan-guarantor';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {LoanGuarantorService} from '../../loan-management/loan/loan-guarantor/loan-guarantor.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {ApiConfig} from '../api.config';

@Component({
  selector: 'app-view-loan-guarantor-list',
  templateUrl: './view-loan-guarantor-list.component.html',
  styleUrls: ['./view-loan-guarantor-list.component.scss']
})
export class ViewLoanGuarantorListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'guarantor'];
  page: number;
  size: number;
  perPageOptions = [];
  totalItems: number;
  loan: Loan;
  title: string;
  loanGuarantorListSubject: BehaviorSubject<LoanGuarantor[]> = new BehaviorSubject(null);
  formResponseSubscription: Subscription;
  getAllPagedSubscription: Subscription;
  deleteSubscription: Subscription;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private loanGuarantorService: LoanGuarantorService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ViewLoanGuarantorListComponent>,
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
    this.getAllPagedSubscription = this.loanGuarantorService.getAllPaged(page, size, loanId).subscribe((response) => {
      this.loanGuarantorListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getLoanGuarantorList(): Observable<LoanGuarantor[]> {
    return this.loanGuarantorListSubject.asObservable();
  }

  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    this.loadData(this.page, this.size, this.loan.id);
  }

}
