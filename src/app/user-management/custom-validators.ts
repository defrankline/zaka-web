import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export class CustomValidators {
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }

      const valid = regex.test(control.value);
      return valid ? null : error;
    };
  }

  static passwordMatchValidator(control: AbstractControl): void {
    const password: string = control.get('password').value;
    const passwordConfirmation: string = control.get('passwordConfirmation').value;
    if (password !== passwordConfirmation) {

      control.get('passwordConfirmation').setErrors({NoPasswordMatch: true});
    }
  }

}

