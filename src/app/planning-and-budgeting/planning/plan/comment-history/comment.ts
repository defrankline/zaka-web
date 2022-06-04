import {Plan} from '../plan';

export interface Comment {
  id: number;
  comment: any;
  fromEntity: string;
  toEntity: string;
  plan: Plan;
  seen: boolean;
  commentTime: string;
}
