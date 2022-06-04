import {FormControl} from '@angular/forms';

export interface InputField<T> {
  type?: string;
  isRequired: boolean;
  pattern?: string;
  label: string;
  placeholder?: string;
  errorMsg: string;
  formControl: FormControl;
  items?: T[];
}
