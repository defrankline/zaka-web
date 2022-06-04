export interface RevenueProjectionDto {
  id?: number;
  item: string;
  lastYearProjection: number;
  lastYearActual: number;
  currentYearProjection: number;
  currentYearActual: number;
  nextYearProjection: number;
  code: string;
}

export interface ExpenditureEstimateDto {
  id?: number;
  item: string;
  lastYearBudget: number;
  lastYearActual: number;
  currentYearBudget: number;
  currentYearActual: number;
  nextYearBudget: number;
  code: string;
}

export interface RevenueProjectionAndExpenditureEstimate{
  revenueItems: RevenueProjectionDto[];
  expenditureItems: ExpenditureEstimateDto[];
}


