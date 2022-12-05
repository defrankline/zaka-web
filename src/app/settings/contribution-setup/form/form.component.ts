import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {Contribution} from '../contribution';
import {ContributionService} from '../contribution.service';
import {GfsCode} from '../../gfs-code/gfs-code';
import {GfsCodeService} from '../../gfs-code/gfs-code.service';
import {LiturgicalYearService} from '../../liturgical-year/liturgical-year.service';
import {LiturgicalYear} from '../../liturgical-year/liturgical-year';
import {ToastService} from "../../../shared/services/toast.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  loading: boolean;
  action: string;
  title: string;
  formGroup: UntypedFormGroup;
  contributions: Contribution[];
  contribution?: Contribution;

  gfsCodeControl = new UntypedFormControl(null, [Validators.required]);
  isLoading = false;
  gfsCodes: GfsCode[] | null = [];
  years: LiturgicalYear[];

  constructor(
    private datePipe: DatePipe,
    private contributionService: ContributionService,
    private gfsCodeService: GfsCodeService,
    private liturgicalYearService: LiturgicalYearService,
    private dialogRef: MatDialogRef<FormComponent>,
    private toast: ToastService,
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.loading = false;
    this.action = data.action;
    this.title = data.title;
    if (data.contribution !== undefined) {
      this.contribution = data.contribution;
      this.gfsCodeControl.setValue(this.contribution.gfsCode);
    }
  }

  ngOnInit(): void {
    this.formGroup = this.initFormGroup();
    this.loadContributions();
    this.loadGfsCodes();
    this.loadYears();
  }

  loadYears(): void {
    this.liturgicalYearService.getAll().subscribe(response => {
      this.years = response.data;
    });
  }

  trackLiturgicalYearId(index: number, item: LiturgicalYear): number {
    return item.id;
  }

  loadGfsCodes(): void {
    this.gfsCodeControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(value => this.gfsCodeService.getAllByGfsCodeType('REVENUE', value, 0, 20).pipe(finalize(() => (this.isLoading = false))))
      )
      .subscribe(response => {
        this.gfsCodes = response.data.content;
      });
  }

  displayGfsCode(gfsCode: GfsCode): string {
    if (gfsCode) {
      return gfsCode.code + ' - ' + gfsCode.name;
    } else {
      return '';
    }
  }

  loadContributions(): void {
    this.contributionService.getAll().subscribe((response) => {
      this.contributions = response.data;
    }, error => {
      this.toast.success('Success!','Contributions could not be loaded!');
    });
  }

  initFormGroup(): UntypedFormGroup {
    if (this.contribution === undefined) {
      return this.formBuilder.group(
        {
          name: ['', [Validators.required]],
          minAmount: [0, [Validators.required, Validators.min(0)]],
          startDate: [this.datePipe.transform(Date.now(), 'yyyy-MM-dd'), [Validators.required]],
          endDate: ['', [Validators.required]],
          number: ['', [Validators.required]],
          year: [null, [Validators.required]],
          message: ['Ubarikiwe', [Validators.required]],
        },
      );
    } else {
      return this.formBuilder.group(
        {
          id: [this.contribution.id, Validators.required],
          name: [this.contribution.name, [Validators.required]],
          minAmount: [this.contribution.minAmount, [Validators.required, Validators.min(0)]],
          startDate: [this.datePipe.transform(this.contribution.startDate, 'yyyy-MM-dd'), [Validators.required]],
          endDate: [this.datePipe.transform(this.contribution.endDate, 'yyyy-MM-dd'), [Validators.required]],
          number: [this.contribution.number, [Validators.required]],
          year: [this.contribution.year, [Validators.required]],
          message: [this.contribution.message, [Validators.required]],
        }
      );
    }
  }


  store(contribution: Contribution) {
    contribution.startDate = this.datePipe.transform(contribution.startDate, 'yyyy-MM-dd');
    contribution.endDate = this.datePipe.transform(contribution.endDate, 'yyyy-MM-dd');
    contribution.gfsCode = this.gfsCodeControl.value as GfsCode;
    if (this.contribution === undefined) {
      this.loading = true;
      this.contributionService.store(contribution)
        .pipe(finalize(() => this.loading = false))
        .subscribe(response => {
          this.dialogRef.close(response);
        }, error => {
          this.toast.success('Success!','Error', error.error.message);
        });
    } else {
      this.loading = true;
      this.contributionService.update(contribution)
        .pipe(finalize(() => this.loading = false))
        .subscribe(response => {
          this.dialogRef.close(response);
        }, error => {

          this.toast.success('Success!','Contribution could not be updated!');
        });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
