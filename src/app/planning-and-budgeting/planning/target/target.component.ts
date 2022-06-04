import {Component, OnInit} from '@angular/core';
import {ApiConfig} from '../../../shared';
import {BehaviorSubject, Observable} from 'rxjs';
import {Target} from './target';
import {TargetService} from './target.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ToastService} from '../../../shared/services/toast.service';
import {FormComponent} from '../objective/target/form/form.component';
import Swal from 'sweetalert2';
import {StrategyComponent} from '../objective/target/strategy/strategy.component';
import {FinancialYear} from '../../../setup-and-configuration/cooperative/financial-year/financial-year';
import {FormControl} from '@angular/forms';
import {FinancialYearService} from '../../../setup-and-configuration/cooperative/financial-year/financial-year.service';
import {ObjectiveService} from '../objective/objective.service';
import {Objective} from '../objective/objective';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {PlanService} from '../plan/plan.service';
import {Plan} from '../plan/plan';

@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.scss']
})
export class TargetComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'code', 'description', 'objective', 'year', 'manage'];
  page = ApiConfig.page;
  size = ApiConfig.size;
  perPageOptions = ApiConfig.perPageOptions;
  totalItems = 0;
  financialYearId = 0;
  financialYear: FinancialYear;
  objectiveId = 0;
  objective: Objective;
  planId = 0;
  plan: Plan;
  private targetListSubject: BehaviorSubject<Target[]> = new BehaviorSubject([]);
  financialYearControl = new FormControl(null);
  planControl = new FormControl(null);
  objectiveControl = new FormControl(null);
  financialYears: FinancialYear[] = [];
  objectives: Objective[];
  plans: Plan[];
  isLoading = false;

  constructor(private targetService: TargetService,
              private toast: ToastService,
              private planService: PlanService,
              private objectiveService: ObjectiveService,
              private financialYearService: FinancialYearService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loadData(this.page, this.size, this.objectiveId);
    this.loadFinancialYears();
  }

  loadData(page: number, size: number, objectiveId: number): void {
    this.targetService.getAll(page, size, objectiveId).subscribe((response) => {
      this.targetListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
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
      this.targetService.getAllByFinancialYear(this.financialYearId, this.page, this.size).subscribe((response) => {
        this.targetListSubject.next(response.data.content);
        this.totalItems = response.data.totalElements;
        this.loadPlans(this.financialYearId);
      });
    }
  }

  filterByPlan(plan: Plan): void {
    if (plan) {
      this.planId = plan.id;
      this.plan = plan;
      this.targetService.getAllByPlan(this.planId, this.page, this.size).subscribe((response) => {
        this.targetListSubject.next(response.data.content);
        this.totalItems = response.data.totalElements;
        this.loadObjectives(this.planId);
      });
    }
  }

  filterByObjective(objective: Objective): void {
    if (objective) {
      this.objectiveId = objective.id;
      this.objective = objective;
      this.loadData(this.page, this.size, this.objectiveId);
    }
  }


  loadPlans(financialYearId: number): void {
    if (financialYearId > 0) {
      this.planService.getAll(financialYearId).subscribe((response) => {
        this.plans = response.data;
      });
    }
  }


  loadObjectives(planId: number): void {
    this.objectiveService.getAll(planId).subscribe((response) => {
      this.objectives = response.data;
    });
  }

  getItems(): Observable<Target[]> {
    return this.targetListSubject.asObservable();
  }

  form(row?: Target): void {
    const data = {
      target: row ? row : undefined,
      objective: this.objective
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = data;
    const dl = this.dialog.open(FormComponent, dialogConfig);
    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        this.loadData(this.page, this.size, this.objectiveId);
        this.toast.success('Success', 'Target created successfully!');
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
        this.targetService.delete(row.id)
          .subscribe((response) => {
            this.loadData(this.page, this.size, this.objectiveId);
            this.toast.success('Success!', 'Target deleted successfully!');
          });
      }
    });
  }

  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    if (this.financialYearId > 0 && this.planId === 0 && this.objectiveId === 0) {
      this.filterByFinancialYear();
    } else if (this.planId > 0 && this.objectiveId === 0) {
      this.filterByPlan(this.plan);
    } else {
      this.loadData(this.page, this.size, this.objectiveId);
    }
  }

  strategies(row: Target): void {
    const data = {
      target: row
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    dialogConfig.data = data;
    this.dialog.open(StrategyComponent, dialogConfig);
  }
}
