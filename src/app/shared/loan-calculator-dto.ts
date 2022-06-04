import {LoanProduct} from '../setup-and-configuration/loan-management/loan-product/loan-product';
import {LoanRepayment} from '../loan-management/loan/loan-repayment/loan-repayment';

export interface LoanCalculatorDto {
  id?: number;
  loanProduct: LoanProduct;
  amount: number;
  tenure: number;
  startDate: string;
  installmentAmount?: number;
  totalInterest?: number;
  totalLoan?: number;
  insurance: number;
  loanFee: number;
  processingFee: number;
  net: number;
  loanRepaymentList?: LoanRepayment[];
}

export interface LoanEditDto {
  id: number;
  loanProduct: LoanProduct;
  amount: number;
  tenure: number;
  principalRepaid: number;
  interestRepaid: number;
  dateDisbursed: string;
}
