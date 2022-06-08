import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {DashboardStatDto} from './dashboard-stat';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {ToastService} from "../shared/services/toast.service";
import {CustomResponse} from "../shared/custom-response";
import {DivisionService} from "../settings/division/division.service";
import {FormComponent} from "../income-and-expenditure/contribution-payment/form/form.component";

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  statSubject: BehaviorSubject<DashboardStatDto[]> = new BehaviorSubject([]);

  constructor(private divisionService: DivisionService,
              private toast: ToastService,
              private router: Router,
              private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.divisionService.dashboardStat().subscribe(response => {
      this.statSubject.next(response.data);
    });
  }

  getStats(): Observable<DashboardStatDto[]> {
    return this.statSubject.asObservable();
  }

  contributionForm(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    const dl = this.dialog.open(FormComponent, dialogConfig);
    dl.afterClosed().subscribe((response: CustomResponse) => {
      if (response) {
        this.toast.success('Success', response.message);
      }
    }, error => this.toast.error('Error', error.error.message));
  }

  parishioners(): void {
    this.router.navigate(['/app/parishioner-management/parishioners']);
  }
}
