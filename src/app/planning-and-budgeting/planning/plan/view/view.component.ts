import {Component, OnInit} from '@angular/core';
import {PlanService} from '../plan.service';
import {ToastService} from '../../../../shared/services/toast.service';
import {BudgetObjectiveDto, Plan} from '../plan';
import {BehaviorSubject, Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  private planListSubject: BehaviorSubject<BudgetObjectiveDto[]> = new BehaviorSubject([]);
  plan: Plan;
  id: number;

  constructor(private planService: PlanService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private toast: ToastService) {
    this.id = this.activatedRoute.snapshot.params.id;
  }

  ngOnInit(): void {
    this.loadData(this.id);
  }

  loadData(id: number): void {
    this.planService.view(id).subscribe((response) => {
      if (response.status === 200) {
        this.plan = response.other;
        this.planListSubject.next(response.data);
      } else {
        this.plan = response.other;
        this.toast.warning('No data', 'Planning not yet done');
      }
    });
  }

  getItems(): Observable<BudgetObjectiveDto[]> {
    return this.planListSubject.asObservable();
  }

  close(): void {
    this.router.navigate(['app/planning-and-budgeting/planning/financial-year-plans']);
  }

  create(): void {
    this.router.navigate(['app/planning-and-budgeting/planning/financial-year-plans/projection', this.plan.id]);
  }

  print(): void {
    this.planService.print(this.plan.id).subscribe(response => {
      saveAs(new Blob([response], {type: 'application/pdf'}), Date.now() + '-budget.pdf');
    });
  }
}
