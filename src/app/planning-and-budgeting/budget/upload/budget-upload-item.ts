import {FinancialYear} from '../../../setup-and-configuration/cooperative/financial-year/financial-year';
import {Budget} from '../budget';

export interface BudgetUploadItem {
  item: string;
  code: string;
  type: string;
  budget: number;
  actual: number;
}

export interface BudgetUpload {
  financialYear: FinancialYear;
  parent: Budget;
  type: string;
  boardApprovalDocument: any;
  items: BudgetUploadItem[];
}
