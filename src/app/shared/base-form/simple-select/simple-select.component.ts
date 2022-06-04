import {Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-simple-select',
  templateUrl: './simple-select.component.html',
  styleUrls: ['./simple-select.component.scss']
})
export class SimpleSelectComponent<T> {
  @Input() isRequired = false;
  @Input() label: string = null;
  @Input() placeholder: string;
  @Input() errorMsg: string;
  @Input() formControl: FormControl;
  @Input() items: T[];
}
