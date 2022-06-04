import {Division} from '../division/division';
import {GfsCode} from '../gfs-code/gfs-code';
import {LiturgicalYear} from '../liturgical-year/liturgical-year';

export interface Contribution {
  id: number;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  gfsCode: GfsCode;
  division: Division;
  minAmount: number;
  year: LiturgicalYear;
  message: string;
}
