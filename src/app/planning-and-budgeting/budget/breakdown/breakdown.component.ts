import {Component, OnInit} from '@angular/core';
import {Budget} from '../budget';
import {BudgetService} from '../budget.service';
import {BudgetProjectionVsActual} from './budget-projection-vs-actual';
import {ActivatedRoute, Router} from '@angular/router';
import {saveAs} from 'file-saver';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {DetailComponent} from './detail/detail.component';

@Component({
  selector: 'app-breakdown',
  templateUrl: './breakdown.component.html',
  styleUrls: ['./breakdown.component.scss']
})
export class BreakdownComponent implements OnInit {
  budget: Budget;
  title: string;
  id: number;
  expenditureEstimates: BudgetProjectionVsActual[];
  revenueProjections: BudgetProjectionVsActual[];
  extraOrdinaryRevenueProjections: BudgetProjectionVsActual[];

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private budgetService: BudgetService) {
    this.id = this.activatedRoute.snapshot.params.id;
  }

  ngOnInit(): void {
    this.loadBudget(this.id);
  }

  loadBudget(id: number): void {
    this.budgetService.getOne(id).subscribe(response => {
      this.budget = response.data;
      this.loadData(this.budget.id);
    });
  }

  loadData(id: number): void {
    this.budgetService.printHtml(id).subscribe(response => {
      this.revenueProjections = response.data.revenue;
      this.expenditureEstimates = response.data.expenditure;
      this.extraOrdinaryRevenueProjections = response.data.extraOrdinary;
    });
  }

  close(): void {
    this.router.navigate(['app/planning-and-budgeting/budgets']);
  }

  totalLastYearRevenueProjection(): number {
    if (this.revenueProjections) {
      return this.revenueProjections.map(t => t.lastYearBudget).reduce((acc, value) => acc + value, 0);
    } else {
      return 0;
    }
  }

  totalLastYearActualRevenue(): number {
    if (this.revenueProjections) {
      return this.revenueProjections.map(t => t.lastYearActual).reduce((acc, value) => acc + value, 0);
    } else {
      return 0;
    }
  }

  totalCurrentYearRevenueProjection(): number {
    if (this.revenueProjections) {
      return this.revenueProjections.map(t => t.currentYearBudget).reduce((acc, value) => acc + value, 0);
    } else {
      return 0;
    }
  }

  totalCurrentYearActualRevenue(): number {
    if (this.revenueProjections) {
      return this.revenueProjections.map(t => t.currentYearActual).reduce((acc, value) => acc + value, 0);
    } else {
      return 0;
    }
  }

  totalLastYearExpenditureEstimates(): number {
    if (this.expenditureEstimates) {
      return this.expenditureEstimates.map(t => t.lastYearBudget).reduce((acc, value) => acc + value, 0);
    } else {
      return 0;
    }
  }

  totalLastYearActualExpenditure(): number {
    if (this.expenditureEstimates) {
      return this.expenditureEstimates.map(t => t.lastYearActual).reduce((acc, value) => acc + value, 0);
    } else {
      return 0;
    }
  }

  totalCurrentYearExpenditureEstimates(): number {
    if (this.expenditureEstimates) {
      return this.expenditureEstimates.map(t => t.currentYearBudget).reduce((acc, value) => acc + value, 0);
    } else {
      return 0;
    }
  }

  totalCurrentYearActualExpenditure(): number {
    if (this.expenditureEstimates) {
      return this.expenditureEstimates.map(t => t.currentYearActual).reduce((acc, value) => acc + value, 0);
    } else {
      return 0;
    }
  }

  lastYearProjectionPercentage(row: BudgetProjectionVsActual): number {
    if (row.lastYearActual > 0) {
      return ((row.lastYearBudget * 100) / row.lastYearActual);
    } else {
      return 0;
    }
  }

  currentYearProjectionPercentage(row: BudgetProjectionVsActual): number {
    if (row.currentYearActual > 0) {
      return ((row.currentYearBudget * 100) / row.currentYearActual);
    } else {
      return 0;
    }
  }

  lastYearTotalProjectionPercentage(): number {
    const lastYearProjection = this.totalLastYearRevenueProjection();
    const lastYearActual = this.totalLastYearActualRevenue();
    if (lastYearActual > 0) {
      return (lastYearProjection * 100) / lastYearActual;
    } else {
      return 0;
    }
  }

  currentYearTotalProjectionPercentage(): number {
    const currentYearProjection = this.totalCurrentYearRevenueProjection();
    const currentYearActual = this.totalCurrentYearActualRevenue();
    if (currentYearActual > 0) {
      return (currentYearProjection * 100) / currentYearActual;
    } else {
      return 0;
    }
  }

  lastYearExpenditureEstimatePercentage(row: BudgetProjectionVsActual): number {
    if (row.lastYearActual > 0) {
      return ((row.lastYearBudget * 100) / row.lastYearActual);
    } else {
      return 0;
    }
  }

  currentYearExpenditureEstimatePercentage(row: BudgetProjectionVsActual): number {
    if (row.currentYearActual > 0) {
      return ((row.currentYearBudget * 100) / row.currentYearActual);
    } else {
      return 0;
    }
  }

  lastYearTotalExpenditureEstimatePercentage(): number {
    const lastYearExpenditureEstimate = this.totalLastYearExpenditureEstimates();
    const lastYearActualExpenditure = this.totalLastYearActualExpenditure();
    if (lastYearActualExpenditure > 0) {
      return (lastYearExpenditureEstimate * 100) / lastYearActualExpenditure;
    } else {
      return 0;
    }
  }

  currentYearTotalExpenditureEstimatePercentage(): number {
    const lastYearExpenditureEstimate = this.totalCurrentYearExpenditureEstimates();
    const lastYearActualExpenditure = this.totalCurrentYearActualExpenditure();
    if (lastYearActualExpenditure > 0) {
      return (lastYearExpenditureEstimate * 100) / lastYearActualExpenditure;
    } else {
      return 0;
    }
  }

  print(): void {
    this.budgetService.printPdf(this.id).subscribe(response => {
      saveAs(new Blob([response], {type: 'application/pdf'}), 'makisio-ya-mapato-na-matumizi.pdf');
    });
  }

  totalLastYearExtraOrdinaryRevenueProjection(): number {
    if (this.extraOrdinaryRevenueProjections) {
      return this.extraOrdinaryRevenueProjections.map(t => t.lastYearBudget).reduce((acc, value) => acc + value, 0);
    } else {
      return 0;
    }
  }

  totalCurrentYearExtraOrdinaryRevenueProjection(): number {
    if (this.extraOrdinaryRevenueProjections) {
      return this.extraOrdinaryRevenueProjections.map(t => t.currentYearBudget).reduce((acc, value) => acc + value, 0);
    } else {
      return 0;
    }
  }

  totalLastYearActualExtraOrdinaryRevenue(): number {
    if (this.extraOrdinaryRevenueProjections) {
      return this.extraOrdinaryRevenueProjections.map(t => t.lastYearActual).reduce((acc, value) => acc + value, 0);
    } else {
      return 0;
    }
  }

  totalCurrentYearActualExtraOrdinaryRevenue(): number {
    if (this.extraOrdinaryRevenueProjections) {
      return this.extraOrdinaryRevenueProjections.map(t => t.currentYearActual).reduce((acc, value) => acc + value, 0);
    } else {
      return 0;
    }
  }

  lastYearExtraOrdinaryRevenueProjectionPercentage(row: BudgetProjectionVsActual): number {
    if (row.lastYearActual > 0) {
      return ((row.lastYearBudget * 100) / row.lastYearActual);
    } else {
      return 0;
    }
  }

  currentYearExtraOrdinaryRevenueProjectionPercentage(row: BudgetProjectionVsActual): number {
    if (row.currentYearActual > 0) {
      return ((row.currentYearBudget * 100) / row.currentYearActual);
    } else {
      return 0;
    }
  }

  lastYearTotalExtraOrdinaryRevenueProjectionPercentage(): number {
    const projection = this.totalLastYearExtraOrdinaryRevenueProjection();
    const actual = this.totalLastYearActualExtraOrdinaryRevenue();
    if (actual > 0) {
      return (projection * 100) / actual;
    } else {
      return 0;
    }
  }

  currentYearTotalActualExtraOrdinaryRevenuePercentage(): number {
    const projection = this.totalCurrentYearActualExtraOrdinaryRevenue();
    const actual = this.totalCurrentYearActualExtraOrdinaryRevenue();
    if (actual > 0) {
      return (projection * 100) / actual;
    } else {
      return 0;
    }
  }

  revenueDetail(revenueProjection: BudgetProjectionVsActual): void {

  }

  expenditureDetail(budgetProjectionVsActual: BudgetProjectionVsActual, financialYear: string): void {
    const data = {
      item: budgetProjectionVsActual,
      year: financialYear
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = data;
    this.dialog.open(DetailComponent, dialogConfig);
  }
}
