import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BudgetObjectiveDto, BudgetObjectiveTargetItemDto, NewBudgetCreateDto, Plan} from '../plan/plan';
import {PlanService} from '../plan/plan.service';
import {ToastService} from '../../../shared/services/toast.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivityService} from '../activity/activity.service';

@Component({
  selector: 'app-projection',
  templateUrl: './projection-form.component.html',
  styleUrls: ['./projection-form.component.scss']
})
export class ProjectionFormComponent implements OnInit {
  plan: Plan;
  id: number;
  formGroup: FormGroup;
  items: BudgetObjectiveTargetItemDto[];

  constructor(private planService: PlanService,
              private router: Router,
              private activityService: ActivityService,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private toast: ToastService) {
    this.id = this.activatedRoute.snapshot.params.id;
  }

  ngOnInit(): void {
    this.loadData(this.id);
    this.formGroup = this.fb.group({
      inputSet: this.fb.array([]),
    });
  }

  get inputForms(): FormArray {
    return this.formGroup.get('inputSet') as FormArray;
  }

  loadData(id: number): void {
    this.planService.view(id).subscribe((response) => {
      if (response.status === 200) {
        this.plan = response.other;
        this.processData(response.data);
      } else {
        this.plan = response.other;
        this.toast.warning('No data', 'Planning not yet done');
      }
    });
  }

  processData(objectives: BudgetObjectiveDto[]): void {
    const activities = [];
    if (objectives.length > 0) {
      objectives.map(objective => {
        const targets = objective.targets;
        if (targets.length > 0) {
          targets.map(target => {
            const items = target.items;
            if (items.length > 0) {
              items.map(item => {
                activities.push(item);
              });
            }
          });
        }
      });
    }
    this.items = activities;
    this.addInput(activities);
  }

  addInput(items: BudgetObjectiveTargetItemDto[]): void {
    if (items.length > 0) {
      items.map(row => {
        const item = this.fb.group({
          input: [row, [Validators.required]],
          amount: [row.amount, [Validators.required, Validators.min(0)]],
        });
        this.inputForms.push(item);
      });
    }
  }

  close(): void {
    this.router.navigate(['app/planning-and-budgeting/planning/financial-year-plans']);
  }

  create(): void {
    const items = this.formGroup.get('inputSet').value as any[];
    const payload: NewBudgetCreateDto[] = [];
    items.map(item => {
      const x = {
        id: item.input.activityId,
        amount: item.amount
      } as NewBudgetCreateDto;
      payload.push(x);
    });
    this.activityService.saveProjection(payload).subscribe((response) => {
      this.toast.success('Success!', 'Projection Saved Successfully');
    });
  }

}
