import {LedgerAccount} from '../account/ledger-account';

export interface DefaultAccount {
  id?: number;
  key: string;
  account: LedgerAccount;
}
