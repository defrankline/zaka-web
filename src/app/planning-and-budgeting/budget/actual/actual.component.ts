import {Component, OnInit} from '@angular/core';
import {Budget} from '../budget';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {BudgetService} from '../budget.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Actual, BudgetActualWrapperDto} from './actual';
import {ExpenditureItem} from '../../../income-and-expenditure/expenditure/expenditure';

@Component({
  selector: 'app-actual',
  templateUrl: './actual.component.html',
  styleUrls: ['./actual.component.scss']
})
export class ActualComponent implements OnInit {
  budget: Budget;
  title: string;
  id: number;
  actualSubject: BehaviorSubject<BudgetActualWrapperDto> = new BehaviorSubject(null);

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
    this.budgetService.actualHtml(id).subscribe(response => {
      this.actualSubject.next(response.data);
    });
  }

  getItems(): Observable<BudgetActualWrapperDto> {
    return this.actualSubject.asObservable();
  }


  close(): void {
    this.router.navigate(['app/planning-and-budgeting/budgets']);
  }

  print(): void {

  }

  itemTotal(expenses: ExpenditureItem[]): number {
    return expenses.map(t => t.amount).reduce((acc, value) => acc + value, 0);
  }

  totalExpense(): number {
    const wrapperDto = this.actualSubject.getValue() as BudgetActualWrapperDto;
    const items = wrapperDto.expenditure;
    let total = 0;
    items.map(row => {
      const subTotal = row.expenses.map(t => t.amount).reduce((acc, value) => acc + value, 0);
      total = total + subTotal;
    });
    return total;
  }

  totalRevenueBudget(): number {
    const wrapperDto = this.actualSubject.getValue() as BudgetActualWrapperDto;
    const items = wrapperDto.revenue;
    return items.map(t => t.currentYearBudget).reduce((acc, value) => acc + value, 0);
  }

  totalRevenueActual(): number {
    const wrapperDto = this.actualSubject.getValue() as BudgetActualWrapperDto;
    const items = wrapperDto.revenue;
    return items.map(t => t.currentYearActual).reduce((acc, value) => acc + value, 0);
  }

  totalExtraOrdinaryRevenueBudget(): number {
    const wrapperDto = this.actualSubject.getValue() as BudgetActualWrapperDto;
    const items = wrapperDto.extraOrdinary;
    return items.map(t => t.currentYearBudget).reduce((acc, value) => acc + value, 0);
  }

  totalExtraOrdinaryRevenueActual(): number {
    const wrapperDto = this.actualSubject.getValue() as BudgetActualWrapperDto;
    const items = wrapperDto.extraOrdinary;
    return items.map(t => t.currentYearActual).reduce((acc, value) => acc + value, 0);
  }
}
