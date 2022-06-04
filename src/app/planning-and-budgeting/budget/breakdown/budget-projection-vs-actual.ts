export interface BudgetProjectionVsActualWrapper {
  revenue: BudgetProjectionVsActual[];
  expenditure: BudgetProjectionVsActual[];
}

export interface BudgetProjectionVsActual {
  id: number;
  name: string;
  code: string;
  lastYearBudget: number;
  lastYearActual: number;
  currentYearBudget: number;
  currentYearActual: number;
}

