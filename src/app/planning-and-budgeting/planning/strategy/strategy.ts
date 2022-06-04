import {Target} from '../target/target';

export interface Strategy {
  id: number;
  code: string;
  description: string;
  target: Target;
}
