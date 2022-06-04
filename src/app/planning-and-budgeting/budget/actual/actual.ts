import {ExpenditureItem} from '../../../income-and-expenditure/expenditure/expenditure';
import {Projection} from '../budget';
import {GfsCode} from '../../../income-and-expenditure/gfs-code/gfs-code';

export interface Actual {
  item: any;
  expenses: ExpenditureItem[];
}

export interface BudgetActualExpenditureDto {
  item: GfsCode;
  estimate: Projection;
  expenses: ExpenditureItem[];
}

export interface BudgetActualWrapperDto {
  revenue: BudgetProjectionVsActualDto[];
  expenditure: BudgetActualExpenditureDto[];
  extraOrdinary: BudgetProjectionVsActualDto[];
}


export interface BudgetProjectionVsActualDto {
  name: string;
  currentYearBudget: number;
  currentYearActual: number;
}
