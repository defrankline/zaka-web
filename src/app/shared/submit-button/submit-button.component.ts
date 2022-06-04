import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CompanyCategory} from '../../setup-and-configuration/cooperative/company-category/company-category';
import {AbstractControl, AbstractControlOptions, AsyncValidatorFn, ValidatorFn} from '@angular/forms';
import {LabelAction} from '../base-table/label-action';

@Component({
  selector: 'app-submit-button',
  templateUrl: './submit-button.component.html',
  styleUrls: ['./submit-button.component.scss']
})
export class SubmitButtonComponent {
  @Input('disabled') disabled: boolean;
  @Output('onAction') emitter = new EventEmitter();

  emit(action: any): void {
    this.emitter.emit(action);
  }
}
