import {Component, Inject, OnInit} from '@angular/core';
import {LiturgicalYear} from '../liturgical-year';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {LiturgicalYearService} from '../liturgical-year.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {finalize} from 'rxjs/operators';
import {ToastService} from "../../../shared/services/toast.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [
  ],
})
export class FormComponent implements OnInit {
  loading: boolean;
  action: string;
  title: string;
  formGroup: FormGroup;
  liturgicalYears: LiturgicalYear[];
  liturgicalYear?: LiturgicalYear;

  constructor(
    private datePipe: DatePipe,
    private liturgicalYearService: LiturgicalYearService,
    private dialogRef: MatDialogRef<FormComponent>,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.loading = false;
    this.action = data.action;
    this.title = data.title;
    if (data.liturgicalYear !== undefined) {
      this.liturgicalYear = data.liturgicalYear;
    }
  }

  ngOnInit(): void {
    this.formGroup = this.initFormGroup();
    this.loadLiturgicalYears();
  }

  loadLiturgicalYears(): void {
    this.liturgicalYearService.getAll().subscribe((response) => {
      this.liturgicalYears = response.data;
    }, error => {
      this.toast.success('Success!','Liturgical Years could not be loaded!');
    });
  }

  initFormGroup(): FormGroup {
    if (this.liturgicalYear === undefined) {
      return this.formBuilder.group(
        {
          name: ['', [Validators.required]],
          startDate: [this.datePipe.transform(Date.now(), 'yyyy-MM-dd'), [Validators.required]],
          endDate: ['', [Validators.required]],
          previous: [null],
        },
      );
    } else {
      return this.formBuilder.group(
        {
          id: [this.liturgicalYear.id, Validators.required],
          name: [this.liturgicalYear.name, [Validators.required]],
          previous: [this.liturgicalYear.previous],
          startDate: [this.datePipe.transform(this.liturgicalYear.startDate, 'yyyy-MM-dd'), [Validators.required]],
          endDate: [this.datePipe.transform(this.liturgicalYear.endDate, 'yyyy-MM-dd'), [Validators.required]],
        }
      );
    }
  }


  store(liturgicalYear: LiturgicalYear) {
    liturgicalYear.startDate = this.datePipe.transform(liturgicalYear.startDate, 'yyyy-MM-dd');
    liturgicalYear.endDate = this.datePipe.transform(liturgicalYear.endDate, 'yyyy-MM-dd');
    if (this.liturgicalYear === undefined) {
      this.loading = true;
      this.liturgicalYearService.store(liturgicalYear)
        .pipe(finalize(() => this.loading = false))
        .subscribe(response => {
          this.dialogRef.close(response);
        }, error => {
          this.toast.success('Success!',error.error.message);
        });
    } else {
      this.loading = true;
      this.liturgicalYearService.update(liturgicalYear)
        .pipe(finalize(() => this.loading = false))
        .subscribe(response => {
          this.dialogRef.close(response);
        }, error => {

          this.toast.success('Success!','Liturgical Year could not be updated!',);
        });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  trackLiturgicalYearId(index: number, item: LiturgicalYear): number {
    return item.id;
  }
}
