import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastService} from '../../../../shared/services/toast.service';
import {AccountService} from '../../../../accounting/account/account.service';
import {finalize} from 'rxjs/operators';
import {FundSourceService} from '../fund-source.service';
import {FundSource} from '../fund-source';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  loading: boolean;
  title: string;
  formGroup: FormGroup;
  fundSource: FundSource;

  constructor(
    private fundSourceService: FundSourceService,
    private dialogRef: MatDialogRef<FormComponent>,
    private toast: ToastService,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.loading = false;
    this.title = data.title;
    if (data.fundSource !== undefined) {
      this.fundSource = data.fundSource;
    }
  }

  ngOnInit(): void {
    this.formGroup = this.initFormGroup();
  }


  initFormGroup(): FormGroup {
    if (this.fundSource === undefined) {
      return this.formBuilder.group({
        name: ['', Validators.required],
        description: [''],
      });
    } else {
      return this.formBuilder.group({
        id: [this.fundSource.id, Validators.required],
        name: [this.fundSource.name, Validators.required],
        description: [this.fundSource.description],
      });
    }
  }


  store(fundSource: FundSource): void {
    if (this.fundSource === undefined) {
      this.loading = true;
      this.fundSourceService.create(fundSource)

        .subscribe(response => {
          this.dialogRef.close(response);
        }, error => {
          this.toast.error('Error', error.error.message);
        });
    } else {
      this.loading = true;
      this.fundSourceService.update(fundSource)

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
