import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ApiConfig} from '../../../shared';
import Swal from 'sweetalert2';
import {Objective} from './objective';
import {ObjectiveService} from './objective.service';
import {FormComponent} from './form/form.component';
import {FormControl} from '@angular/forms';
import {ToastService} from '../../../shared/services/toast.service';
import {FinancialYear} from '../../../setup-and-configuration/cooperative/financial-year/financial-year';
import {FinancialYearService} from '../../../setup-and-configuration/cooperative/financial-year/financial-year.service';
import {TargetComponent} from './target/target.component';
import {CopyComponent} from '../plan/copy/copy.component';
import {PlanService} from '../plan/plan.service';
import {Plan} from '../plan/plan';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-objective',
  templateUrl: './objective.component.html',
  styleUrls: ['./objective.component.scss']
})
export class ObjectiveComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'code', 'description', 'financialYear', 'manage'];
  page = ApiConfig.page;
  size = ApiConfig.size;
  perPageOptions = ApiConfig.perPageOptions;
  totalItems = 0;
  queryString = '_';
  financialYearId = 0;
  financialYear: FinancialYear;
  plan: Plan;
  planId = 0;
  private objectiveListSubject: BehaviorSubject<Objective[]> = new BehaviorSubject([]);
  financialYearControl = new FormControl(null);
  planControl = new FormControl(null);
  financialYears: FinancialYear[];
  plans: Plan[];
  isLoading = false;

  constructor(
    private objectiveService: ObjectiveService,
    private financialYearService: FinancialYearService,
    private planService: PlanService,
    private dialog: MatDialog,
    private toast: ToastService
  ) {
  }

  ngOnInit(): void {
    this.loadData(this.page, this.size, this.financialYearId);
    this.loadFinancialYears();
  }

  loadFinancialYears(): void {
    this.financialYearControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(value => this.financialYearService.getAllPaged(0, 10, value).pipe(finalize(() => (this.isLoading = false))))
      ).subscribe(response => {
      this.financialYears = response.data.content;
    });
  }

  displayFinancialYear(user: FinancialYear): string {
    if (user) {
      return user.name;
    } else {
      return '';
    }
  }

  filterByFinancialYear(): void {
    const financialYear = this.financialYearControl.value as FinancialYear;
    if (financialYear) {
      this.financialYearId = financialYear.id;
      this.financialYear = financialYear;
      this.loadData(this.page, this.size, this.financialYearId);
    }
  }

  loadData(page: number, size: number, financialYearId: number): void {
    this.objectiveService.getAllByFinancialYear(financialYearId, page, size).subscribe((response) => {
      this.objectiveListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
      this.loadPlans(financialYearId);
    });
  }

  loadPlans(financialYearId: number): void {
    if (financialYearId > 0) {
      this.planService.getAll(financialYearId).subscribe(response => {
        this.plans = response.data;
      });
    }
  }

  filterByPlan(plan: Plan): void {
    if (plan) {
      this.planId = plan.id;
      this.plan = plan;
      this.objectiveService.getAll(this.planId, this.page, this.size).subscribe((response) => {
        this.objectiveListSubject.next(response.data.content);
        this.totalItems = response.data.totalElements;
      });
    }
  }

  getItems(): Observable<Objective[]> {
    return this.objectiveListSubject.asObservable();
  }

  form(row?: Objective): void {
    const data = {
      objective: row ? row : undefined,
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
        this.toast.success('Success', 'Objective created successfully!');
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
        this.objectiveService.delete(row.id)
          .subscribe((response) => {
            this.loadData(this.page, this.size, this.financialYearId);
            this.toast.success('Success!', 'Objective deleted successfully!');
          });
      }
    });
  }

  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    this.loadData(this.page, this.size, this.financialYearId);
  }

  targets(row: Objective): void {
    const data = {
      objective: row
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    dialogConfig.data = data;
    const dl = this.dialog.open(TargetComponent, dialogConfig);
    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        this.loadData(this.page, this.size, this.financialYearId);
      }
    });
  }
}
