import {LedgerAccount} from '../account/ledger-account';

export interface PaymentMethod {
  id?: number;
  code: string;
  name: string;
  account: LedgerAccount;
}
