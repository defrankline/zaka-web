import {Objective} from '../objective/objective';

export interface Target {
  id?: number;
  code: string;
  description: string;
  objective: Objective;
}
