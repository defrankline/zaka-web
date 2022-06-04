import {LedgerAccount} from '../account/ledger-account';

export class GfsCode {
  id?: number;
  name: string;
  code: string;
  minAmount: number;
  mandatory: boolean;
  description: string;
  account: LedgerAccount;
  payingAccount: LedgerAccount;
  gfsCodeType: GfsCodeType;
  expenditureType: ExpenditureType;
}

export enum GfsCodeType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE'
}

export enum ExpenditureType {
  REVENUE = 'REVENUE',
  CAPITAL = 'CAPITAL'
}

