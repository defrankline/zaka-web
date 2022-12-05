import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UntypedFormControl, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {ToastService} from "../../../shared/services/toast.service";
import {ContributionService} from '../../../settings/contribution-setup/contribution.service';
import {Contribution} from '../../../settings/contribution-setup/contribution';
import {ContributionPaymentUploadDto, ContributionPaymentUploadItemDto} from '../contribution-payment';
import {User} from '../../../user-management/user/user';
import {ContributionPaymentService} from '../contribution-payment.service';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {UserService} from '../../../user-management/user/user.service';
import {PaymentMethod, PaymentMethodService} from '../../../settings/payment-method';
import Swal from 'sweetalert2';
import {CustomResponse} from "../../../shared/custom-response";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  dateFormat = 'yyyy-MM-dd';
  amountControl = new UntypedFormControl(0, [Validators.required, Validators.min(1)]);
  paymentVoucherNumberControl = new UntypedFormControl('');
  contributionControl = new UntypedFormControl(null, [Validators.required]);
  paymentMethodControl = new UntypedFormControl(null, [Validators.required]);
  userControl = new UntypedFormControl(null, [Validators.required]);
  level2Control = new UntypedFormControl(null);
  level3Control = new UntypedFormControl(null);
  dateControl = new UntypedFormControl(this.datePipe.transform(Date.now(), this.dateFormat), [Validators.required]);
  intendedDateControl = new UntypedFormControl(this.datePipe.transform(Date.now(), this.dateFormat), [Validators.required]);
  isLoading = false;
  members: User[] | null = [];
  contributions: Contribution[] | null = [];
  paymentMethods: PaymentMethod[];

  constructor(private dialogRef: MatDialogRef<FormComponent>,
              private toast: ToastService,
              private datePipe: DatePipe,
              private paymentMethodService: PaymentMethodService,
              private userService: UserService,
              private contributionService: ContributionService,
              private paymentService: ContributionPaymentService,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) private data: any) {
  }

  ngOnInit(): void {
    this.searchMembers();
    this.loadContributions();
    this.loadPaymentMethods();
    this.loadLastReceiptNumber();
  }

  loadLastReceiptNumber():void{
    this.paymentService.newReceiptNumber().subscribe({
      next: this.lastNumberSuccess.bind(this),
      error: this.lastNumberError.bind(this),
    })
  }

  lastNumberSuccess(response: CustomResponse):void{
    this.paymentVoucherNumberControl.setValue(response.data);
  }

  lastNumberError(response: HttpErrorResponse):void{

  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Do it!'
    }).then(result => {
      if (result.value) {
        this.store();
      }
    });
  }

  private store(): void {
    const user = this.userControl.value as User;
    this.isLoading = true;
    const items = [];
    const contribution = this.contributionControl.value as Contribution;
    const paymentMethod = this.paymentMethodControl.value as PaymentMethod;
    const item = {
      firstName: user.firstName,
      surname: user.surname,
      number: user.number,
      paymentVoucherNumber: this.paymentVoucherNumberControl.value as string,
      amount: this.amountControl.value as number,
      date: this.datePipe.transform(this.dateControl.value, this.dateFormat).toString(),
      intendedDate: this.datePipe.transform(this.intendedDateControl.value, this.dateFormat).toString(),
      itemCode: contribution.number,
      paymentMethodCode: paymentMethod.code,
      cardNumber: user.cardNumber
    } as ContributionPaymentUploadItemDto;
    items.push(item);
    const payload = {
      items: items,
    } as ContributionPaymentUploadDto;
    this.paymentService.upload(payload).subscribe(response => {
      this.dialogRef.close(response);
      this.isLoading = false;
    }, error => {
      this.toast.error('Error!', error.error.message);
      this.isLoading = false;
    });
  }

  loadPaymentMethods(): void {
    this.paymentMethodService.getAll().subscribe((response) => {
      this.paymentMethods = response.data;
      const paymentMethod = this.paymentMethods.find(row => row.code === '1060') as PaymentMethod;
      this.paymentMethodControl.setValue(paymentMethod);
    }, error => {
      this.toast.error('Error!', 'Oops! Payment Methods could not be loaded!');
    });
  }

  loadContributions(): void {
    this.contributionService.getAll().subscribe((response) => {
      this.contributions = response.data;
      this.contributionControl.setValue(this.contributions[0]);
    }, error => {
      this.toast.error('Error!', 'Oops! Contributions could not be loaded!');
    });
  }

  searchMembers(): void {
    this.userControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(value => this.userService.search(0, 50, value).pipe(finalize(() => (this.isLoading = false))))
      )
      .subscribe(response => {
        this.members = response.data.content;
      });
  }

  displayMember(user: User): string {
    if (user) {
      return user.cardNumber;
    } else {
      return '';
    }
  }

  setLocation(): void {
    const user = this.userControl.value;
    this.level2Control.setValue(user.division?.name);
    this.level3Control.setValue(user.division?.parent?.number+' - '+user.division?.parent?.name);
  }
}
