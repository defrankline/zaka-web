import {AccountGroup} from '../account-group/account-group';
import {LiturgicalYear} from '../liturgical-year/liturgical-year';

export interface LedgerAccount {
  id?: number;
  name: string;
  number: string;
  balance: number;
  overdraft: boolean;
  accountGroup: AccountGroup;
}

export enum BalanceNature {
  DEBIT = 0,
  CREDIT = 1
}

export interface BalanceNatureItem {
  id: string;
  name: string;
}


export interface FinancialStatementDto {
  id?: number;
  name: string;
  number: string;
  monthToDate: number;
  previousMonth: number;
}

export interface IncomeStatementDto {
  interestIncomeList: FinancialStatementDto[];
  interestExpenseList: FinancialStatementDto[];
  noneInterestIncomeList: FinancialStatementDto[];
  operatingExpenseList: FinancialStatementDto[];
  loanLossProvisionList: FinancialStatementDto[];
  extraOrdinaryIncomeList: FinancialStatementDto[];
  extraOrdinaryExpenseList: FinancialStatementDto[];
  currentLiturgicalYear: LiturgicalYear;
  today: string;
  allowanceForBadDebtRecovery: FinancialStatementDto;
  dividendPaid: FinancialStatementDto;
}

export interface LiquidAssetDto {
  currentFinancialYear: LiturgicalYear;
  currentMonth: string;
  cashInHand: number;
  bankAndOther: number;
  receivable030: number;
  governmentSecurity030: number;
  investmentInBankAndOther: number;
  mobileMoney: number;
  agentBanking: number;
  savingAndDeposit: number;
  accountPayable030: number;
  shortTermBorrowingSacco030: number;
  shortTermBorrowingBankAndOther030: number;
}
