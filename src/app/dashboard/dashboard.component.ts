import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {DashboardStatDto, MonthlyStatDto} from './dashboard-stat';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {ToastService} from "../shared/services/toast.service";
import {CustomResponse} from "../shared/custom-response";
import {DivisionService} from "../settings/division/division.service";
import {FormComponent} from "../income-and-expenditure/contribution-payment/form/form.component";
import {Chart} from 'angular-highcharts';
import {ContributionPaymentService} from "../income-and-expenditure/contribution-payment/contribution-payment.service";
import {FormControl} from "@angular/forms";
import {DatePipe} from "@angular/common";

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  statSubject: BehaviorSubject<DashboardStatDto[]> = new BehaviorSubject([]);
  monthlyStatSubject: BehaviorSubject<MonthlyStatDto[]> = new BehaviorSubject([]);

  chart = new Chart(
    {
      chart: {
        type: 'column'
      },
      title: {
        align: 'left',
        text: 'Browser market shares. January, 2022'
      },
      subtitle: {
        align: 'left',
        text: 'Click the columns to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>'
      },
      accessibility: {
        announceNewData: {
          enabled: true
        }
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: 'Total percent market share'
        }

      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y:.1f}%'
          }
        }
      },

      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
      },

      series: [
        {
          type: undefined,
          name: "Browsers",
          colorByPoint: true,
          data: []
        }
      ]
    }
  );

  start = '';
  end = '';
  productControl = new FormControl();
  startDateControl = new FormControl('');
  endDateControl = new FormControl('');
  max = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');

  constructor(private divisionService: DivisionService,
              private toast: ToastService,
              private router: Router,
              private datePipe: DatePipe,
              private paymentService: ContributionPaymentService,
              private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.loadStats();
    this.loadMonthlyStats(this.start, this.end);
  }

  loadMonthlyStats(startDate: string, endDate: string): void {
    this.paymentService.monthlyReport(startDate, endDate).subscribe(response => {
      this.monthlyStatSubject.next(response.data);
      this.prepareChart(response.data);
    });
  }

  loadStats(): void {
    this.divisionService.dashboardStat().subscribe(response => {
      this.statSubject.next(response.data);
    });
  }

  getStats(): Observable<DashboardStatDto[]> {
    return this.statSubject.asObservable();
  }

  getMonthlyStats(): Observable<MonthlyStatDto[]> {
    return this.monthlyStatSubject.asObservable();
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

  filterByDateRange(): void {
    if (this.startDateControl.value && this.endDateControl.value) {
      this.start = this.datePipe.transform(
        this.startDateControl.value,
        'yyyy-MM-dd'
      );
      this.end = this.datePipe.transform(
        this.endDateControl.value,
        'yyyy-MM-dd'
      );
      this.loadMonthlyStats(this.start, this.end);
    } else {
      this.start = '';
      this.end = '';
      this.loadMonthlyStats(this.start, this.end);
    }
  }

  private prepareChart(data: MonthlyStatDto[]) {
    if (data.length > 0) {
      data.map(row => {
        this.chart.addPoint({name: row.month, y: row.amount} as any)
      })
    }
  }
}
