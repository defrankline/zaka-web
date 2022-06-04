import {BudgetApprovalStage} from '../../setup-and-configuration/general/budget-approval-stage/budget-approval-stage';
import {FinancialYear} from '../../setup-and-configuration/cooperative/financial-year/financial-year';
import {Company} from '../../tenancy/company';
import {Comment} from './comment-history/comment';
import {GfsCode} from '../../income-and-expenditure/gfs-code/gfs-code';

export interface Budget {
  id?: number;
  name: string;
  approved: boolean;
  closed: boolean;
  approvalStage: BudgetApprovalStage;
  financialYear: FinancialYear;
  company: Company;
  parent?: Budget;
  type: string;
  boardApprovalDocument: any;
  registrarApprovalDocument: any;
  revenueProjections?: Projection[];
  expenditureEstimates?: Projection[];
  extraOrdinaryRevenueProjections?: Projection[];
  comments?: Comment[];
}

export interface Projection {
  id?: number;
  input: GfsCode;
  budget: Budget;
  description: string;
  amount: number;
  actual: number;
  ceiling: number;
}
