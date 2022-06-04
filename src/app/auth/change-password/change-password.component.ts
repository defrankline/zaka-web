import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../user-management/user';
import {ToastrService} from 'ngx-toastr';
import {CustomValidators} from '../../user-management/user/custom-validators';
import {PasswordReset} from '../../user-management/user/password-reset';
import {finalize} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  hide = true;
  loading: boolean;
  title: string;
  formGroup: FormGroup;
  userId: number;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private toast: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.formGroup = this.initFormGroup();
  }


  initFormGroup(): FormGroup {
    return this.formBuilder.group(
      {
        password: ['', Validators.compose([
          Validators.required,
          CustomValidators.patternValidator(/\d/, {hasNumber: true}),
          CustomValidators.patternValidator(/[A-Z]/, {hasCapitalCase: true}),
          CustomValidators.patternValidator(/[a-z]/, {hasSmallCase: true}),
          Validators.minLength(8),
        ])],
        passwordConfirmation: ['', Validators.compose([Validators.required])]
      },
      {
        validator: CustomValidators.passwordMatchValidator
      });
  }

  change(passwordReset: PasswordReset) {
    passwordReset.userId = this.userId;
    this.loading = true;
    this.authService.changePassword(passwordReset)

      .subscribe(response => {
        if (response.status === 201) {
          this.authService.logout();
          const url = 'auth/login';
          this.router.navigate([url]);
          this.toast.success('Password changed successfully!, Login to continue', 'Success', {
            timeOut: 5000
          });
        } else {
          this.toast.error('Password could not be changed!', 'Error', {
            timeOut: 5000
          });
        }
      }, error => {
        this.toast.error(error.error.message, 'Error', {
          timeOut: 5000
        });
      });
  }
}
