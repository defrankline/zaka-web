import {Role} from '../role/role';
import {Division} from '../../settings/division/division';

export interface User {
  id?: number;
  username: string;
  firstName: string;
  middleName: string;
  surname: string;
  email: string;
  mobile: string;
  gender: string;
  number: string;
  division: Division;
  administrationDivision: Division;
  dob: string;
  dateBaptized: string;
  eucharistDate: string;
  confirmationDate: string;
  marriageDate: string;
  ordinationDate: string;
  password: string;
  cardNumber: string;
  roles: Role[];
}

export interface UserUpload {
  division: Division;
  administrationDivision: Division;
  users: User[];
}
