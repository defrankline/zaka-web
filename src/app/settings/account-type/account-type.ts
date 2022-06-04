import {AccountSubType} from '../account-sub-type/account-sub-type';
import {BalanceNature} from '../account/ledger-account';

export interface AccountType {
  id?: number;
  name: string;
  code: string;
  balanceNature: BalanceNature;
  accountSubTypes?: AccountSubType[];
}
