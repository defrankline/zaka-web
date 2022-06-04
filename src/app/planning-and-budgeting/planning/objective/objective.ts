import {Plan} from '../plan/plan';

export interface Objective {
  id: number;
  name: string;
  code: string;
  plan: Plan;
}
