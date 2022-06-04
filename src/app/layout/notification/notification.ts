import {User} from '../../user-management/user';

export interface Notification {
  id: number;
  responseType: string;
  seen: boolean;
  title: string;
  message: string;
  time: string;
  user: User;
  sender: User;
}
