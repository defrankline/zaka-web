import {AccountSubType} from '../account-sub-type/account-sub-type';
import {BalanceNature} from '../account/ledger-account';

export interface AccountGroup {
  id?: number;
  name: string;
  code: string;
  newCode: string;
  balanceNature: BalanceNature;
  accountSubType: AccountSubType;
}
