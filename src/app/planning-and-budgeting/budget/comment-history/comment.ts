import {Budget} from '../budget';

export interface Comment {
  id: number;
  comment: any;
  fromEntity: string;
  toEntity: string;
  budget: Budget;
  seen: boolean;
  commentTime: string;
}
