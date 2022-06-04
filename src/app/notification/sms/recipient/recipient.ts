import {Sms} from '../sms';
import {User} from '../../../user-management/user/user';

export interface Recipient {
  id: number;
  sms: Sms;
  user: User;
  sent: boolean;
  delivered: boolean;
  failureReason: string;
}
