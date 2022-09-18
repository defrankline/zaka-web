import {Contribution} from '../../settings/contribution-setup/contribution';
import {User} from '../../user-management/user/user';
import {PaymentMethod} from "../../settings/payment-method";

export interface ContributionPayment {
  id?: number;
  contribution: Contribution;
  user: User;
  amount: number;
  paymentVoucherNumber: string;
  datePaid: string;
  intendedDate: string;
  dateVerified: string;
  verified: boolean;
  paymentMethod: PaymentMethod;
}

export interface ContributionPaymentUploadDto {
  items: ContributionPaymentUploadItemDto[];
}

export interface ContributionPaymentUploadItemDto {
  firstName: string;
  surname: string;
  number: string;
  amount: number;
  date: string;
  intendedDate: string;
  itemCode: string;
  paymentVoucherNumber: string;
  paymentMethodCode: string;
  cardNumber: string;
}
