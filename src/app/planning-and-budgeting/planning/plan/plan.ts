import {User} from '../../../user-management/user';
import {FinancialYear} from '../../../setup-and-configuration/cooperative/financial-year/financial-year';
import {GfsCode} from '../../../income-and-expenditure/gfs-code/gfs-code';
import {BudgetApprovalStage} from '../../../setup-and-configuration/general/budget-approval-stage/budget-approval-stage';
import {Comment} from './comment-history/comment';

export interface Plan {
  id?: number;
  approved: boolean;
  name: string;
  current: boolean;
  closed: boolean;
  dateApproved: string;
  approvedBy: User;
  financialYear: FinancialYear;
  approvalStage: BudgetApprovalStage;
  boardApprovalDocument: string;
  approvalDocument: string;
  comments: Comment[];
}

export interface BudgetObjectiveDto {
  id: number;
  name: string;
  code: string;
  targets: BudgetObjectiveTargetDto[];
}

export interface BudgetObjectiveTargetDto {
  id: number;
  description: string;
  code: string;
  items: BudgetObjectiveTargetItemDto[];
}

export interface BudgetObjectiveTargetItemDto {
  strategy: string;
  activity: string;
  implementationIndicator: string;
  fundSource: string;
  inputCode: string;
  inputName: string;
  activityId: number;
  amount: number;
  actual: number;
  ceiling: number;
}

export interface NewBudgetCreateDto {
  id: number;
  amount: number;
}
