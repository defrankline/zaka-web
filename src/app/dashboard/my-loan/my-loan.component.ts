import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {LoanService} from '../../loan-management/loan/loan.service';
import {LoanProductService} from '../../setup-and-configuration/loan-management/loan-product/loan-product.service';
import {LoanProduct} from '../../setup-and-configuration/loan-management/loan-product/loan-product';
import {CustomResponse} from '../../shared/custom-response';
import {FinancialYear} from '../../setup-and-configuration/cooperative/financial-year/financial-year';
import {BehaviorSubject, Observable} from 'rxjs';
import {Loan} from '../../loan-management/loan/loan';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ApiConfig} from '../../shared';
import Swal from 'sweetalert2';
import {MyLoanRepaymentListComponent} from '../../self-service/my-loans/my-loan-repayment-list/my-loan-repayment-list.component';
import {LoanCollateral} from '../../loan-management/loan/loan-collateral/loan-collateral';
import {
  MyLoanCollateralListComponent
} from '../../self-service/my-loans/my-loan-collateral/my-loan-collateral-list/my-loan-collateral-list.component';
import {LoanGuarantor} from '../../loan-management/loan/loan-guarantor/loan-guarantor';
import {LoanGuarantorListComponent} from '../../loan-management/loan/loan-guarantor/loan-guarantor-list/loan-guarantor-list.component';
import {LoanUsage} from '../../loan-management/loan/loan-usage/loan-usage';
import {MyLoanUsageListComponent} from '../../self-service/my-loans/my-loan-usage/my-loan-usage-list/my-loan-usage-list.component';
import {ContractComponent} from '../../self-service/my-loans/my-loan-list/contract/contract.component';
import {saveAs} from 'file-saver';
import {RepaymentComponent} from '../../self-service/my-loans/my-loan-list/repayment/repayment.component';
import {Router} from '@angular/router';
import {ToastService} from '../../shared/services/toast.service';

@Component({
  selector: 'app-my-loan',
  templateUrl: './my-loan.component.html',
  styleUrls: ['./my-loan.component.scss']
})
export class MyLoanComponent implements OnInit {
  id: number;
  loanProduct: LoanProduct;
  displayedColumns: string[] = ['id', 'loan', 'dateApplied', 'product', 'dateDisbursed', 'type',
    'tenure', 'interest', 'deductions', 'net', 'principalRepaid', 'interestRepaid', 'pendingPrincipal',
    'pendingInterest', 'totalPendingLoan', 'status', 'manage'
  ];
  page: number;
  size: number;
  perPageOptions = [];
  totalItems: number;
  financialYears: FinancialYear[];
  loanListSubject: BehaviorSubject<Loan[]> = new BehaviorSubject([]);

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private dialogRef: MatDialogRef<MyLoanComponent>,
              private loanProductService: LoanProductService,
              private loanService: LoanService,
              private router: Router,
              private dialog: MatDialog,
              private toastService: ToastService,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.id = data.id;
    this.page = ApiConfig.page;
    this.size = ApiConfig.size;
    this.perPageOptions = ApiConfig.perPageOptions;
  }

  ngOnInit(): void {
    this.loadProduct(this.id);
    this.loadData(this.page, this.size, this.id);
  }

  loadProduct(id: number): void {
    this.loanProductService.get(id).subscribe((response: CustomResponse) => {
      this.loanProduct = response.data;
    });
  }

  loadData(page: number, size: number, loanProductId: number): void {
    this.loanService.getAllPagedByCurrentUser(page, size, loanProductId).subscribe((response) => {
      this.loanListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  getLoans(): Observable<Loan[]> {
    return this.loanListSubject.asObservable();
  }

  delete(index: number, row: Loan): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!', showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.loanService.delete(row.id)
          .subscribe((response) => {
            this.loadData(this.page, this.size, this.id);
            this.toastService.success('Success!', 'Loan deleted successfully!');
          });
      }
    });
  }

  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    this.loadData(this.page, this.size, this.id);
  }

  repayments(index: number, loan: Loan): void {
    this.data = {
      title: 'Repayments',
      loan,
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '90%';
    dialogConfig.data = this.data;
    const dl = this.dialog.open(MyLoanRepaymentListComponent, dialogConfig);
    dl.afterClosed().subscribe((response: any) => {
      this.loadData(this.page, this.size, this.id);
    });
  }

  collateral(i: any, row: LoanCollateral): void {
    this.data = {
      title: 'Loan Collateral',
      loan: row,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '90%';
    dialogConfig.data = this.data;
    this.dialog.open(MyLoanCollateralListComponent, dialogConfig);
  }

  guarantor(i: any, row: LoanGuarantor): void {
    this.data = {
      title: 'Loan Guarantors',
      loan: row,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '90%';
    dialogConfig.data = this.data;
    this.dialog.open(LoanGuarantorListComponent, dialogConfig);
  }

  usage(i: any, row: LoanUsage): void {
    this.data = {
      title: 'Loan Usage',
      loan: row,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '90%';
    dialogConfig.data = this.data;
    this.dialog.open(MyLoanUsageListComponent, dialogConfig);
  }

  getTotalAmountApproved(): number {
    const items = this.loanListSubject.getValue();
    return items.map(t => t.amountApproved).reduce((acc, value) => acc + value, 0);
  }

  getTotalLoan(): number {
    const items = this.loanListSubject.getValue();
    return items.map(t => t.amount).reduce((acc, value) => acc + value, 0);
  }

  deductions(row: Loan): number {
    const insurance = Number(row.insurance);
    const processingFee = Number(row.processingFee);
    const loanForm = Number(row.loanFee);
    let pendingLoan = 0;
    if (row.topUpLoan) {
      pendingLoan = (row.topUpLoan.amountApproved - Number(row.topUpLoan.principalRepaid))
        + (row.topUpLoan.interest - Number(row.topUpLoan.interestRepaid)) + Number(row.topUpLoan.penalty);
    }
    return insurance + processingFee + loanForm + pendingLoan;
  }

  getTotalDeductions(): number {
    const items = this.loanListSubject.getValue();
    let total = 0;
    items.map(loan => {
      total = total + this.deductions(loan);
    });
    return total;
  }

  getTotalInterest(): number {
    const items = this.loanListSubject.getValue();
    return items.map(t => t.interest).reduce((acc, value) => acc + value, 0);
  }

  getTotalAmountRepaid(): number {
    const items = this.loanListSubject.getValue();
    return items.map(t => t.amountRepaid).reduce((acc, value) => acc + value, 0);
  }

  getTotalPrincipalRepaid(): number {
    const items = this.loanListSubject.getValue();
    return items.map(t => t.principalRepaid).reduce((acc, value) => acc + value, 0);
  }

  getTotalInterestRepaid(): number {
    const items = this.loanListSubject.getValue();
    return items.map(t => t.interestRepaid).reduce((acc, value) => acc + value, 0);
  }

  getTotalPendingPrincipal(): number {
    return (this.getTotalAmountApproved() - this.getTotalPrincipalRepaid());
  }

  getTotalPendingInterest(): number {
    return (this.getTotalInterest() - this.getTotalInterestRepaid());
  }

  getTotalPendingLoan(): number {
    return (this.getTotalPendingPrincipal() + this.getTotalPendingInterest());
  }


  getTotalAmountDisbursed(): number {
    const items = this.loanListSubject.getValue();
    return items.map(t => t.amountDisbursed).reduce((acc, value) => acc + value, 0);
  }

  contract(row: Loan): void {
    const data = {
      title: 'Contract',
      loan: row,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '90%';
    dialogConfig.data = data;
    const dl = this.dialog.open(ContractComponent, dialogConfig);
    dl.afterClosed().subscribe((response: any) => {
      this.loadData(this.page, this.size, this.id);
    });
  }

  getTotalNet(): number {
    const items = this.loanListSubject.getValue();
    return items.map(t => t.amountDisbursed).reduce((acc, value) => acc + value, 0);
  }

  topUp(row: Loan): void {
    this.router.navigate(['/app/self-service/loans/topup', row.id]);
  }

  downloadLoanApplicationForm(loan: Loan): void {
    this.loanService.loanApplicationForm(loan.id).subscribe(response => {
      saveAs(new Blob([response], {type: 'application/pdf'}), loan.user.number + ' - ' + Date.now() + ' - loan-application-form.pdf');
    });
  }

  loanRepaymentSubmissionHistory(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '90%';
    this.dialog.open(RepaymentComponent, dialogConfig);
  }
}
