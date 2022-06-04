import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {finalize} from 'rxjs/operators';
import {Plan} from '../../plan';
import {Objective} from '../../../objective/objective';
import {ToastService} from '../../../../../shared/services/toast.service';
import {ObjectiveService} from '../../../objective/objective.service';
import {AccountService} from '../../../../../accounting/account/account.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  loading: boolean;
  title: string;
  formGroup: FormGroup;
  objective: Objective;
  plan: Plan;

  constructor(
    private objectiveService: ObjectiveService,
    private dialogRef: MatDialogRef<FormComponent>,
    private toast: ToastService,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.loading = false;
    this.title = data.title;
    if (data.objective !== undefined) {
      this.objective = data.objective;
    }
    this.plan = data.plan;
  }

  ngOnInit(): void {
    this.formGroup = this.initFormGroup();
  }


  initFormGroup(): FormGroup {
    if (this.objective === undefined) {
      return this.formBuilder.group({
        name: ['', Validators.required],
        code: ['', Validators.required],
      });
    } else {
      return this.formBuilder.group({
        id: [this.objective.id, Validators.required],
        name: [this.objective.name, Validators.required],
        code: [this.objective.code, Validators.required],
      });
    }
  }


  store(objective: Objective): void {
    objective.plan = this.plan;
    if (this.objective === undefined) {
      this.loading = true;
      this.objectiveService.create(objective)

        .subscribe(response => {
          this.dialogRef.close(response);
        }, error => {
          this.toast.error('Error', error.error.message);
        });
    } else {
      this.loading = true;
      this.objectiveService.update(objective)

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
