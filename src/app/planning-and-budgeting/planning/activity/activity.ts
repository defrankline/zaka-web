import {Strategy} from '../strategy/strategy';
import {GfsCode} from '../../../income-and-expenditure/gfs-code/gfs-code';
import {FundSource} from '../fund-source/fund-source';

export class Activity {
  id?: number;
  code: string;
  description: string;
  strategy: Strategy;
  fundSource: FundSource;
  input: GfsCode;
  implementationIndicator: string;
  amount: number;
  actual: number;
  ceiling: number;
}
