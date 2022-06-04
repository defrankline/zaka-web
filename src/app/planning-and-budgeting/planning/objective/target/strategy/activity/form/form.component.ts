import {Component, Inject, OnInit} from '@angular/core';
import {Strategy} from '../../../../../strategy/strategy';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ToastService} from '../../../../../../../shared/services/toast.service';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {Activity} from '../../../../../activity/activity';
import {ActivityService} from '../../../../../activity/activity.service';
import {GfsCodeService} from '../../../../../../../income-and-expenditure/gfs-code/gfs-code.service';
import {GfsCode} from '../../../../../../../income-and-expenditure/gfs-code/gfs-code';
import {FundSource} from '../../../../../fund-source/fund-source';
import {FundSourceService} from '../../../../../fund-source/fund-source.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  strategy: Strategy;
  activity: Activity;
  formGroup: FormGroup;
  loading = false;
  inputControl = new FormControl(null, [Validators.required]);
  isLoading = false;
  inputs: GfsCode[] | null = [];
  fundSources: FundSource[];

  constructor(private activityService: ActivityService,
              private dialogRef: MatDialogRef<FormComponent>,
              private toast: ToastService,
              private gfsCodeService: GfsCodeService,
              private fundSourceService: FundSourceService,
              private dialog: MatDialog,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    if (data.activity !== undefined) {
      this.activity = data.activity;
      this.inputControl.setValue(this.activity.input);
    }
    this.strategy = data.strategy;
  }

  ngOnInit(): void {
    this.formGroup = this.initFormGroup();
    this.filterInputs();
    this.loadFundSources();
  }

  loadFundSources(): void {
    this.fundSourceService.getAll().subscribe(res => {
      this.fundSources = res.data;
    });
  }

  filterInputs(): void {
    this.inputControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(value => this.gfsCodeService.getAll(value, 0, 20).pipe(finalize(() => (this.isLoading = false))))
      )
      .subscribe(response => {
        this.inputs = response.data.content;
      });
  }

  initFormGroup(): FormGroup {
    if (this.activity === undefined) {
      return this.formBuilder.group({
        description: ['', Validators.required],
        code: ['', Validators.required],
        fundSource: [null, Validators.required],
        implementationIndicator: ['', Validators.required],
        amount: [0, [Validators.required, Validators.min(0)]],
      });
    } else {
      return this.formBuilder.group({
        id: [this.activity.id, Validators.required],
        description: [this.activity.description, Validators.required],
        code: [this.activity.code, Validators.required],
        fundSource: [this.activity.fundSource, Validators.required],
        implementationIndicator: [this.activity.implementationIndicator, Validators.required],
        amount: [this.activity.amount, [Validators.required, Validators.min(0)]],
      });
    }
  }


  store(item: Activity): void {
    item.strategy = this.strategy;
    item.input = this.inputControl.value as GfsCode;
    if (this.activity === undefined) {
      this.loading = true;
      this.activityService.create(item)

        .subscribe(response => {
          this.dialogRef.close(response);
        }, error => {
          this.toast.error('Error', error.error.message);
        });
    } else {
      this.loading = true;
      this.activityService.update(item)

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

  displayInput(item?: GfsCode): string | undefined {
    return item ? item.code + ' - ' + item.name : undefined;
  }

  checkInput(): void {
    if (this.formGroup.get('input').value) {
      const x = this.formGroup.get('input').value as GfsCode;
      if (x === null) {
        this.formGroup.get('input').reset();
      } else {
        if (!x.id) {
          this.formGroup.get('input').reset();
        }
      }
    }
  }

  trackFundSourceId(index: number, item: FundSource): number {
    return item.id;
  }
}
