import {DivisionLevel} from '../level/level';

export class Division {
  id?: number;
  name: string;
  level: DivisionLevel;
  parent?: Division;
  smsCount?: number;
  number?: string;
  mobile?: string;
  fax?: string;
  location?: string;
  telephone?: string;
  postalAddress?: string;
  email?: string;
  paymentInstruction?: string;
  letterHead?: string;
}

export interface DivisionTree {
  id: number;
  name: string;
  number: string;
  children: DivisionTree[];
  hasChildren: boolean;
  level: DivisionLevel;
}
