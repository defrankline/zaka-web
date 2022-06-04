import {User} from '../../user-management/user/user';
import {ReminderCategory} from '../../settings/reminder-category/reminder-category';

export interface Sms {
  id: number;
  senderId: string;
  message: any;
  timeSent: string;
  sentBy: User;
  published: boolean;
  category: ReminderCategory;
}

export interface BulkSmsDto {
  id?: number;
  destinations: User[];
  teller: User;
  senderId: string;
  msg: string;
  published: boolean;
  category: ReminderCategory;
}
