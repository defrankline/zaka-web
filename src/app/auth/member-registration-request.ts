import {MemberType} from '../setup-and-configuration/membership/member-type/member-type';

export interface MemberRegistrationRequest {
  username: string;
  email: string;
  firstName: string;
  middleName: string;
  password: string;
  surname: string;
  mobile: string;
  company: string;
  acceptTerms: boolean;
  gender: string;
  guarantors: string[];
  referencePersonNumber?: string;
  type: MemberType;
}
