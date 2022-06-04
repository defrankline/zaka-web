import {Component, Inject, OnInit} from '@angular/core';
import {TargetService} from '../../../target/target.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ToastService} from '../../../../../shared/services/toast.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Target} from '../../../target/target';
import {Objective} from '../../objective';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  target: Target;
  objective: Objective;
  formGroup: FormGroup;
  loading = false;

  constructor(private targetService: TargetService,
              private dialogRef: MatDialogRef<FormComponent>,
              private toast: ToastService,
              private dialog: MatDialog,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    if (data.target !== undefined) {
      this.target = data.target;
    }
    this.objective = data.objective;
  }

  ngOnInit(): void {
    this.formGroup = this.initFormGroup();
  }


  initFormGroup(): FormGroup {
    if (this.target === undefined) {
      return this.formBuilder.group({
        description: ['', Validators.required],
        code: ['', Validators.required],
      });
    } else {
      return this.formBuilder.group({
        id: [this.target.id, Validators.required],
        description: [this.target.description, Validators.required],
        code: [this.target.code, Validators.required],
      });
    }
  }


  store(item: Target): void {
    item.objective = this.objective;
    if (this.target === undefined) {
      this.loading = true;
      this.targetService.create(item)

        .subscribe(response => {
          this.dialogRef.close(response);
        }, error => {
          this.toast.error('Error', error.error.message);
        });
    } else {
      this.loading = true;
      this.targetService.update(item)

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
