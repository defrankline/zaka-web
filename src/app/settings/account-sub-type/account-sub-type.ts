import {AccountGroup} from '../account-group/account-group';
import {AccountType} from '../account-type/account-type';

export interface AccountSubType {
  id?: number;
  name: string;
  code: string;
  accountType: AccountType;
  accountGroups?: AccountGroup[];
}
