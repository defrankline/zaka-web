import {AbstractControl, ValidatorFn} from '@angular/forms';

export function DateGreaterThanValidator(compareDate: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const firstDate = new Date(compareDate);
    const secondDate = new Date(control.value);
    return firstDate > secondDate ? {isLessDate: true} : null;
  };
}

export function DateLessThanValidator(compareDate: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const firstDate = new Date(compareDate);
    const secondDate = new Date(control.value);
    return firstDate < secondDate ? {isGreaterDate: true} : null;
  };
}

export function StartEndDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const startDate = control.get('startDate');
  const endDate = control.get('endDate');
  if (startDate.pristine || endDate.pristine) {
    return null;
  }
  const startDateDate = new Date(startDate.value);
  const endDateDate = new Date(endDate.value);
  return startDate && endDate && endDateDate < startDateDate
    ? {invalidDateRange: true}
    : null;
}
