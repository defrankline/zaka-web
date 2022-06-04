import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {CustomValidators} from '../custom-validators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from "../user/user";
import {UserService} from "../user/user.service";
import {PasswordReset} from "./password-reset";

@Component({
  selector: 'app-password-reset-form',
  templateUrl: './password-reset-form.component.html',
  styleUrls: ['./password-reset-form.component.scss']
})
export class PasswordResetFormComponent implements OnInit, OnDestroy {

  loading: boolean;
  title: string;
  formGroup: FormGroup;
  storeSubscription: Subscription;
  subscribeStore: boolean;
  user: User;

  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<PasswordResetFormComponent>,
    private toast: ToastrService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.loading = false;
    this.subscribeStore = false;
    this.title = data.title;
    this.user = data.user;
  }

  ngOnInit(): void {
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

  reset(passwordReset: PasswordReset): void {
    passwordReset.userId = this.user.id;
    this.loading = true;
    this.subscribeStore = true;
    this.storeSubscription = this.userService.passwordReset(passwordReset)

      .subscribe(response => {
        this.dialogRef.close(response);
      }, error => {
        this.toast.error(error.error.message, 'Error', {
          timeOut: 5000
        });
      });
  }

  ngOnDestroy(): void {
    if (this.subscribeStore === true) {
      this.storeSubscription.unsubscribe();
    }
  }

}
