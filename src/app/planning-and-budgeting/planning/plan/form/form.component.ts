import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {Plan} from '../plan';
import {PlanService} from '../plan.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastService} from '../../../../shared/services/toast.service';
import {AccountService} from '../../../../accounting/account/account.service';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {FinancialYear} from '../../../../setup-and-configuration/cooperative/financial-year/financial-year';
import {FinancialYearService} from '../../../../setup-and-configuration/cooperative/financial-year/financial-year.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  loading: boolean;
  title: string;
  plan: Plan;

  financialYearControl = new FormControl(null);
  nameControl = new FormControl('', [Validators.required]);
  financialYears: FinancialYear[] = [];
  isLoading = false;

  constructor(
    private planService: PlanService,
    private financialYearService: FinancialYearService,
    private dialogRef: MatDialogRef<FormComponent>,
    private toast: ToastService,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.loading = false;
    this.title = data.title;
    if (data.plan !== undefined) {
      this.plan = data.plan;
      this.nameControl.setValue(this.plan.name);
      this.financialYearControl.setValue(this.plan.financialYear);
    }
  }

  ngOnInit(): void {
    this.loadFinancialYears();
  }

  loadFinancialYears(): void {
    this.financialYearControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(value => this.financialYearService.getAllPaged(0, 10, value).pipe(finalize(() => (this.isLoading = false))))
      ).subscribe(response => {
      this.financialYears = response.data.content;
    });
  }

  displayFinancialYear(user: FinancialYear): string {
    if (user) {
      return user.name;
    } else {
      return '';
    }
  }

  store(): void {
    if (this.plan === undefined) {
      this.loading = true;
      const payload = {
        name: this.nameControl.value as string,
        financialYear: this.financialYearControl.value as FinancialYear
      } as Plan;
      this.planService.create(payload)

        .subscribe(response => {
          this.dialogRef.close(response);
        }, error => {
          this.toast.error('Error', error.error.message);
        });
    } else {
      this.loading = true;
      const payload = {
        id: this.plan.id,
        name: this.nameControl.value as string,
        financialYear: this.financialYearControl.value as FinancialYear
      } as Plan;
      this.planService.update(payload)

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
