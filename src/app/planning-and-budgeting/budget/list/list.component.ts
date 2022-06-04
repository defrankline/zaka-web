import {Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ToastService} from '../../../shared/services/toast.service';
import {ApiConfig} from '../../../shared';
import Swal from 'sweetalert2';
import {BudgetService} from '../budget.service';
import {FormControl} from '@angular/forms';
import {FinancialYearService} from '../../../setup-and-configuration/cooperative/financial-year/financial-year.service';
import {FinancialYear} from '../../../setup-and-configuration/cooperative/financial-year/financial-year';
import {Budget} from '../budget';
import {CommitteeDocumentComponent} from '../committee-document/committee-document.component';
import {RegistrarDocumentComponent} from '../registrar-document/registrar-document.component';
import {ResponseComponent} from '../response/response.component';
import {CommentHistoryComponent} from '../comment-history/comment-history.component';
import {ApproveComponent} from '../approve/approve.component';
import {Router} from '@angular/router';
import {saveAs} from 'file-saver';
import {Expenditure} from '../../../income-and-expenditure/expenditure/expenditure';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'type', 'stage', 'financialYear', 'approvalStatus', 'response', 'document', 'manage'];
  page: number;
  size: number;
  perPageOptions = [];
  totalItems: number;
  financialYearId = 0;
  financialYearControl = new FormControl(null);
  budgetStatusControl = new FormControl('APPROVED');
  financialYears: FinancialYear[];
  budgetTypes = ['ANNUAL', 'SUPPLEMENTARY'];
  budgetListSubject: BehaviorSubject<Budget[]> = new BehaviorSubject([]);
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(
    private budgetService: BudgetService,
    private financialYearService: FinancialYearService,
    private dialog: MatDialog,
    private router: Router,
    private toast: ToastService
  ) {
    this.page = ApiConfig.page;
    this.size = ApiConfig.size;
    this.perPageOptions = ApiConfig.perPageOptions;
  }

  ngOnInit(): void {
    this.loadFinancialYears();
    this.loadData(this.page, this.size, this.financialYearId);
  }

  loadFinancialYears(): void {
    this.financialYearService.getAll().subscribe(response => {
      this.financialYears = response.data;
    });
  }

  loadData(page: number, size: number, financialYearId: number): void {
    this.budgetService.getAllPaged(page, size, financialYearId).subscribe((response) => {
      this.budgetListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getBudgets(): Observable<Budget[]> {
    return this.budgetListSubject.asObservable();
  }

  create(): void {
    this.router.navigate(['app/planning-and-budgeting/budgets/create']);
  }

  edit(row: Expenditure): void {
    this.router.navigate(['app/planning-and-budgeting/budgets/edit', row.id]);
  }

  delete(index, row): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!', showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.budgetService.delete(row.id)
          .subscribe((response) => {
            const items = this.budgetListSubject.getValue();
            items.splice(index, 1);
            this.toast.success('Success!', 'Budget Deleted Successfully!', 5000);
          });
      }
    });
  }


  filter(financialYear: FinancialYear): void {
    if (financialYear) {
      this.financialYearId = financialYear.id;
      this.loadData(this.page, this.size, this.financialYearId);
    }
  }

  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    this.loadData(this.page, this.size, this.financialYearId);
  }

  approve(row: Budget): void {
    const data = {
      budget: row,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = data;
    const dl = this.dialog.open(ApproveComponent, dialogConfig);
    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        if (response.status === 201 || response.status === 200) {
          this.toast.success('Success!', 'Budget Approved Successfully!', 5000);
          this.loadData(this.page, this.size, this.financialYearId);
        } else {
          this.toast.error('Error!', response.message, 5000);
        }
      }
    });
  }

  itemList(row: Budget): void {
    this.router.navigate(['app/planning-and-budgeting/budgets/breakdown', row.id]);
  }

  actual(row: Budget): void {
    this.router.navigate(['app/planning-and-budgeting/budgets/actual', row.id]);
  }

  filterByStatus(status: string): void {

  }

  sendToDco(row: Budget): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!', showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Submit Budget!'
    }).then(result => {
      if (result.value) {
        this.budgetService.sendToDco(row.id)
          .subscribe((response) => {
            this.loadData(this.page, this.size, this.financialYearId);
            this.toast.success('Success!', 'Budget Sent to DCO Successfully!', 5000);
          });
      }
    });
  }

  sendBackToCommittee(row: Budget): void {
    this.sendFeedback(row);
  }

  sendToRegistrar(row: Budget): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!', showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Submit Budget!'
    }).then(result => {
      if (result.value) {
        this.budgetService.sendToRegistrar(row.id)
          .subscribe((response) => {
            this.loadData(this.page, this.size, this.financialYearId);
            this.toast.success('Success!', 'Budget Sent to Registrar Successfully!', 5000);
          });
      }
    });
  }

  committeeDocument(row: Budget): void {
    const data = {
      budget: row,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '90%';
    dialogConfig.height = '600px';
    dialogConfig.data = data;
    this.dialog.open(CommitteeDocumentComponent, dialogConfig);
  }

  registrarDocument(row: Budget): void {
    const data = {
      budget: row,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '90%';
    dialogConfig.height = '600px';
    dialogConfig.data = data;
    this.dialog.open(RegistrarDocumentComponent, dialogConfig);
  }

  sendBackToDco(row: Budget): void {
    this.sendFeedback(row);
  }

  private sendFeedback(row: Budget): void {
    const data = {
      budget: row,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = data;
    const dl = this.dialog.open(ResponseComponent, dialogConfig);
    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        this.loadData(this.page, this.size, this.financialYearId);
        this.toast.success('Success!', 'Budget Comments Sent Successfully!', 5000);
      }
    });
  }

  comments(row: Budget): void {
    const data = {
      budget: row,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = data;
    const dl = this.dialog.open(CommentHistoryComponent, dialogConfig);
    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        this.loadData(this.page, this.size, this.financialYearId);
      }
    });
  }

  approved(row: FinancialYear, previous: FinancialYear): boolean {
    if (row.current) {
      if (row.previous.id === previous.id) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  upload(): void {
    this.router.navigate(['app/planning-and-budgeting/budgets/upload']);
  }

  print(row: Budget): void {
    this.budgetService.printPdf(row.id).subscribe(response => {
      saveAs(new Blob([response], {type: 'application/pdf'}), Date.now() + '-makisio-ya-mapato-na-matumizi-kwa-mwaka.pdf');
    });
  }
}
