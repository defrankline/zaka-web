import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {ToastService} from '../services/toast.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-inpassword',
  templateUrl: './inpassword.component.html',
  styleUrls: ['./inpassword.component.scss']
})
export class InpasswordComponent implements OnInit {
  passwordControl = new FormControl('', [Validators.required]);
  otpControl = new FormControl('', [Validators.required]);
  otp: number;
  mobile: string;
  hide = true;

  constructor(private authService: AuthService, private toast: ToastService,
              private dialogRef: MatDialogRef<InpasswordComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any) {
  }

  ngOnInit(): void {
    this.generateCurrentUserOtp();
  }

  public generateCurrentUserOtp(): void {
    this.authService.currentUserOTP().subscribe(response => {
      this.otpControl.setValue(response.data as number);
    }, error => {

    });
  }

  close(): void {
    this.dialogRef.close();
  }

  loadLastFour(): string {
    this.mobile = this.authService.getMobile();
    return this.mobile.substr(this.mobile.length - 4);
  }

  public resendOtp(): void {
    this.authService.currentUserOTP().subscribe(response => {
      this.otpControl.setValue(response.data as number);
    });
  }

  public async validateOtp(): Promise<any> {
    try {
      const password = this.passwordControl.value as string;
      const otp = this.otpControl.value as number;
      const response = await this.authService.validateCurrentUser(password, otp);
      this.dialogRef.close(response);
    } catch (e) {
      console.error('Unable to Login!\n', e);
      this.toast.error('Error', e.error.message, 5000);
    }
  }
}
