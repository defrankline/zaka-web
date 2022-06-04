import {BelongingSummary} from '../shared/belonging-summary';

export interface GenderDistributionDto {
  male: number;
  female: number;
}

export interface ManagerDashboardDto {
  genderDistributionDto: GenderDistributionDto;
  shareSummary: BelongingSummary;
  savingSummary: BelongingSummary;
  depositSummary: BelongingSummary;
}
