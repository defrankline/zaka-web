import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CopyComponent} from './copy/copy.component';
import {ApiConfig} from '../../../shared';
import {BehaviorSubject, Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {FinancialYear} from '../../../setup-and-configuration/cooperative/financial-year/financial-year';
import {FinancialYearService} from '../../../setup-and-configuration/cooperative/financial-year/financial-year.service';
import {ToastService} from '../../../shared/services/toast.service';
import {FormComponent} from './form/form.component';
import Swal from 'sweetalert2';
import {Plan} from './plan';
import {PlanService} from './plan.service';
import {ObjectiveComponent} from './objective/objective.component';
import {Router} from '@angular/router';
import {ApproveComponent} from './approve/approve.component';
import {CommitteeDocumentComponent} from './committee-document/committee-document.component';
import {RegistrarDocumentComponent} from './registrar-document/registrar-document.component';
import {ResponseComponent} from './response/response.component';
import {CommentHistoryComponent} from './comment-history/comment-history.component';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'stage', 'financialYear', 'approvalStatus', 'response', 'document', 'manage'];
  page = ApiConfig.page;
  size = ApiConfig.size;
  perPageOptions = ApiConfig.perPageOptions;
  totalItems = 0;
  queryString = '_';
  financialYearId = 0;
  private planListSubject: BehaviorSubject<Plan[]> = new BehaviorSubject([]);
  financialYearControl = new FormControl(null);
  financialYears: FinancialYear[];

  constructor(
    private planService: PlanService,
    private router: Router,
    private financialYearService: FinancialYearService,
    private dialog: MatDialog,
    private toast: ToastService
  ) {
  }

  ngOnInit(): void {
    this.loadData(this.page, this.size, this.financialYearId);
    this.loadFinancialYears();
  }

  loadFinancialYears(): void {
    this.financialYearService.getAll().subscribe(response => {
      this.financialYears = response.data;
    });
  }

  loadData(page: number, size: number, financialYearId: number): void {
    this.planService.getAll(financialYearId, page, size).subscribe((response) => {
      this.planListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getItems(): Observable<Plan[]> {
    return this.planListSubject.asObservable();
  }

  form(row?: Plan): void {
    const data = {
      plan: row ? row : undefined,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = data;
    const dl = this.dialog.open(FormComponent, dialogConfig);
    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        this.loadData(this.page, this.size, this.financialYearId);
        this.toast.success('Success', 'Plan created successfully!');
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
        this.planService.delete(row.id)
          .subscribe((response) => {
            this.loadData(this.page, this.size, this.financialYearId);
            this.toast.success('Success!', 'Plan deleted successfully!');
          });
      }
    });
  }

  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    this.loadData(this.page, this.size, this.financialYearId);
  }

  filter(financialYear: FinancialYear): void {
    if (financialYear) {
      this.financialYearId = financialYear.id;
      this.loadData(this.page, this.size, this.financialYearId);
    }
  }

  copy(row: Plan): void {
    const data = {
      plan: row
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = data;
    const dl = this.dialog.open(CopyComponent, dialogConfig);
    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        this.loadData(this.page, this.size, this.financialYearId);
      }
    });
  }

  view(row: Plan): void {
    this.router.navigate(['app/planning-and-budgeting/planning/financial-year-plans/view', row.id]);
  }

  objectives(row: Plan): void {
    const data = {
      plan: row
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    dialogConfig.data = data;
    const dl = this.dialog.open(ObjectiveComponent, dialogConfig);
    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        this.loadData(this.page, this.size, this.financialYearId);
      }
    });
  }

  approve(row: Plan): void {
    const data = {
      plan: row
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.data = data;
    const dl = this.dialog.open(ApproveComponent, dialogConfig);
    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        this.loadData(this.page, this.size, this.financialYearId);
        this.toast.success('Success', response.message, 10000);
      }
    });
  }

  projection(row: Plan): void {
    this.router.navigate(['app/planning-and-budgeting/planning/financial-year-plans/projection', row.id]);
  }

  sendToDco(row: Plan): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!', showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Submit Budget!'
    }).then(result => {
      if (result.value) {
        this.planService.sendToDco(row.id)
          .subscribe((response) => {
            this.loadData(this.page, this.size, this.financialYearId);
            this.toast.success('Success!', 'Budget Sent to DCO Successfully!', 5000);
          });
      }
    });
  }

  sendBackToCommittee(row: Plan): void {
    this.sendFeedback(row);
  }

  sendToRegistrar(row: Plan): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!', showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Submit Budget!'
    }).then(result => {
      if (result.value) {
        this.planService.sendToRegistrar(row.id)
          .subscribe((response) => {
            this.loadData(this.page, this.size, this.financialYearId);
            this.toast.success('Success!', 'Budget Sent to Registrar Successfully!', 5000);
          });
      }
    });
  }

  committeeDocument(row: Plan): void {
    const data = {
      plan: row,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '90%';
    dialogConfig.height = '600px';
    dialogConfig.data = data;
    this.dialog.open(CommitteeDocumentComponent, dialogConfig);
  }

  registrarDocument(row: Plan): void {
    const data = {
      plan: row,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '90%';
    dialogConfig.height = '600px';
    dialogConfig.data = data;
    this.dialog.open(RegistrarDocumentComponent, dialogConfig);
  }

  sendBackToDco(row: Plan): void {
    this.sendFeedback(row);
  }

  private sendFeedback(row: Plan): void {
    const data = {
      plan: row,
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

  comments(row: Plan): void {
    const data = {
      plan: row,
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
}
