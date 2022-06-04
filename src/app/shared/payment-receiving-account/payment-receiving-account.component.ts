import {Component, Input, OnInit} from '@angular/core';
import {Company} from '../../tenancy/company';

@Component({
  selector: 'app-payment-receiving-account',
  templateUrl: './payment-receiving-account.component.html',
  styleUrls: ['./payment-receiving-account.component.scss']
})
export class PaymentReceivingAccountComponent implements OnInit {
  @Input() company: Company;
  displayedColumns: string[] = ['account'];
  dataSource = [];

  constructor() {
  }

  ngOnInit(): void {
    this.paymentDetails();
  }

  paymentDetails(): void {
    if (this.company.paymentAccountDetail) {
      const x = [];
      this.company.paymentAccountDetail.split('|').map(item => {
        x.push(item);
      });
      this.dataSource = x;
    } else {
      this.dataSource = [];
    }
  }
}
