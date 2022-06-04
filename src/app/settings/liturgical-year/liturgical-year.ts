import {Division} from '../division/division';

export class LiturgicalYear {
  id?: number;
  name: string;
  startDate: string;
  endDate: string;
  current: boolean;
  closed: boolean;
  planning: boolean;
  previous?: LiturgicalYear;
  division: Division;
}
