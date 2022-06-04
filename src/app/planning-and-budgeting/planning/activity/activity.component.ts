import {Component, OnInit} from '@angular/core';
import {ApiConfig} from '../../../shared';
import {FinancialYear} from '../../../setup-and-configuration/cooperative/financial-year/financial-year';
import {Objective} from '../objective/objective';
import {Target} from '../target/target';
import {BehaviorSubject, Observable} from 'rxjs';
import {Strategy} from '../strategy/strategy';
import {FormControl} from '@angular/forms';
import {StrategyService} from '../strategy/strategy.service';
import {ToastService} from '../../../shared/services/toast.service';
import {TargetService} from '../target/target.service';
import {ObjectiveService} from '../objective/objective.service';
import {FinancialYearService} from '../../../setup-and-configuration/cooperative/financial-year/financial-year.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {FormComponent} from '../objective/target/strategy/activity/form/form.component';
import Swal from 'sweetalert2';
import {Activity} from './activity';
import {ActivityService} from './activity.service';
import {Plan} from '../plan/plan';
import {PlanService} from '../plan/plan.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'code', 'description', 'implementationIndicator', 'strategy', 'fundSource', 'input', 'projection', 'target',
    'objective', 'year', 'manage'];
  page = ApiConfig.page;
  size = ApiConfig.size;
  perPageOptions = ApiConfig.perPageOptions;
  totalItems = 0;
  financialYearId = 0;
  financialYear: FinancialYear;
  objectiveId = 0;
  objective: Objective;
  targetId = 0;
  target: Target;
  strategyId = 0;
  strategy: Strategy;
  planId = 0;
  plan: Plan;
  private activityListSubject: BehaviorSubject<Activity[]> = new BehaviorSubject([]);
  financialYearControl = new FormControl(null);
  planControl = new FormControl(null);
  objectiveControl = new FormControl(null);
  targetControl = new FormControl(null);
  strategyControl = new FormControl(null);
  financialYears: FinancialYear[] = [];
  plans: Plan[];
  objectives: Objective[];
  targets: Target[];
  strategies: Strategy[];
  isLoading = false;

  constructor(private activityService: ActivityService,
              private strategyService: StrategyService,
              private toast: ToastService,
              private planService: PlanService,
              private targetService: TargetService,
              private objectiveService: ObjectiveService,
              private financialYearService: FinancialYearService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loadData(this.page, this.size, this.strategyId);
    this.loadFinancialYears();
  }

  loadData(page: number, size: number, strategyId: number): void {
    this.activityService.getAll(page, size, strategyId).subscribe((response) => {
      this.activityListSubject.next(response.data.content);
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
      this.activityService.getAllByFinancialYear(this.financialYearId, this.page, this.size).subscribe((response) => {
        this.activityListSubject.next(response.data.content);
        this.totalItems = response.data.totalElements;
        this.loadPlans(this.financialYearId);
      });
    }
  }

  filterByPlan(plan: Plan): void {
    if (plan) {
      this.planId = plan.id;
      this.plan = plan;
      this.activityService.getAllByPlan(this.planId, this.page, this.size).subscribe((response) => {
        this.activityListSubject.next(response.data.content);
        this.totalItems = response.data.totalElements;
        this.loadObjectives(this.planId);
      });
    }
  }

  filterByObjective(objective: Objective): void {
    if (objective) {
      this.objective = objective;
      this.objectiveId = objective.id;
      this.activityService.getAllByObjective(this.objectiveId, this.page, this.size).subscribe((response) => {
        this.activityListSubject.next(response.data.content);
        this.totalItems = response.data.totalElements;
        this.loadTargets(this.objectiveId);
      });
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

  filterByTarget(target: Target): void {
    if (target) {
      this.target = target;
      this.targetId = target.id;
      this.activityService.getAllByTarget(this.targetId, this.page, this.size).subscribe((response) => {
        this.activityListSubject.next(response.data.content);
        this.totalItems = response.data.totalElements;
        this.loadStrategies(this.targetId);
      });
    }
  }

  filterByStrategy(strategy: Strategy): void {
    if (strategy) {
      this.strategyId = strategy.id;
      this.strategy = strategy;
      this.loadData(this.page, this.size, this.strategyId);
    }
  }

  loadTargets(objectiveId: number): void {
    this.targetService.getAllByObjective(objectiveId).subscribe((response) => {
      this.targets = response.data;
    });
  }

  loadStrategies(targetId: number): void {
    this.strategyService.getAllByTarget(targetId).subscribe((response) => {
      this.strategies = response.data;
    });
  }

  getItems(): Observable<Activity[]> {
    return this.activityListSubject.asObservable();
  }

  form(row?: Activity): void {
    const data = {
      activity: row ? row : undefined,
      strategy: this.strategy
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
        this.toast.success('Success', 'Strategy created successfully!');
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
        this.strategyService.delete(row.id)
          .subscribe((response) => {
            this.loadData(this.page, this.size, this.objectiveId);
            this.toast.success('Success!', 'Strategy deleted successfully!');
          });
      }
    });
  }

  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    if (this.financialYearId > 0 && this.objectiveId === 0 && this.targetId === 0 && this.strategyId === 0) {
      this.filterByFinancialYear();
    } else if (this.objectiveId > 0 && this.targetId === 0 && this.strategyId === 0) {
      this.filterByObjective(this.objective);
    } else if (this.targetId > 0 && this.strategyId === 0) {
      this.filterByTarget(this.target);
    } else if (this.strategyId > 0) {
      this.loadData(this.page, this.size, this.strategyId);
    } else {
      this.loadData(this.page, this.size, this.strategyId);
    }
  }
}
