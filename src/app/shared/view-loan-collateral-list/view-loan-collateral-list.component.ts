import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Loan} from '../../loan-management/loan/loan';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {LoanCollateral} from '../../loan-management/loan/loan-collateral/loan-collateral';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {LoanCollateralService} from '../../loan-management/loan/loan-collateral/loan-collateral.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {ApiConfig} from '../api.config';
import {LoanCollateralAttachmentViewerComponent} from '../../loan-management/loan/loan-collateral/loan-collateral-attachment-viewer/loan-collateral-attachment-viewer.component';

@Component({
  selector: 'app-view-loan-collateral-list',
  templateUrl: './view-loan-collateral-list.component.html',
  styleUrls: ['./view-loan-collateral-list.component.scss']
})
export class ViewLoanCollateralListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'type', 'value', 'location', 'attachment'];
  page: number;
  size: number;
  perPageOptions = [];
  totalItems: number;
  loan: Loan;
  title: string;
  loanCollateralListSubject: BehaviorSubject<LoanCollateral[]> = new BehaviorSubject(null);
  formResponseSubscription: Subscription;
  getAllPagedSubscription: Subscription;
  deleteSubscription: Subscription;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private loanCollateralService: LoanCollateralService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ViewLoanCollateralListComponent>,
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
    this.getAllPagedSubscription = this.loanCollateralService.getAllPaged(page, size, loanId).subscribe((response) => {
      this.loanCollateralListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getLoanCollateralList(): Observable<LoanCollateral[]> {
    return this.loanCollateralListSubject.asObservable();
  }

  getTotalValue() {
    const items = this.loanCollateralListSubject.getValue();
    return items.map(t => t.value).reduce((acc, value) => acc + value, 0);
  }

  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    this.loadData(this.page, this.size, this.loan.id);
  }

  attachment(i: any, row: LoanCollateral) {
    this.data = {
      title: 'Attachment',
      loanCollateral: row,
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '90%';
    dialogConfig.data = this.data;
    this.dialog.open(LoanCollateralAttachmentViewerComponent, dialogConfig);
  }

}
