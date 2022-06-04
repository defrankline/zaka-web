import {Component, Inject, OnInit} from '@angular/core';
import {Target} from '../../../../target/target';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ToastService} from '../../../../../../shared/services/toast.service';
import {finalize} from 'rxjs/operators';
import {Strategy} from '../../../../strategy/strategy';
import {StrategyService} from '../../../../strategy/strategy.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  strategy: Strategy;
  target: Target;
  formGroup: FormGroup;
  loading = false;

  constructor(private strategyService: StrategyService,
              private dialogRef: MatDialogRef<FormComponent>,
              private toast: ToastService,
              private dialog: MatDialog,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    if (data.strategy !== undefined) {
      this.strategy = data.strategy;
    }
    this.target = data.target;
  }

  ngOnInit(): void {
    this.formGroup = this.initFormGroup();
  }


  initFormGroup(): FormGroup {
    if (this.strategy === undefined) {
      return this.formBuilder.group({
        description: ['', Validators.required],
        code: ['', Validators.required],
      });
    } else {
      return this.formBuilder.group({
        id: [this.strategy.id, Validators.required],
        description: [this.strategy.description, Validators.required],
        code: [this.strategy.code, Validators.required],
      });
    }
  }


  store(item: Strategy): void {
    item.target = this.target;
    if (this.strategy === undefined) {
      this.loading = true;
      this.strategyService.create(item)

        .subscribe(response => {
          this.dialogRef.close(response);
        }, error => {
          this.toast.error('Error', error.error.message);
        });
    } else {
      this.loading = true;
      this.strategyService.update(item)

        .subscribe(response => {
          this.dialogRef.close(response);
        }, error => {
          this.toast.error('Error', error.error.message);
        });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
