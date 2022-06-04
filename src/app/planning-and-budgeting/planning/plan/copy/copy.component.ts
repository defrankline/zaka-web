import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Objective} from '../../objective/objective';
import {ObjectiveService} from '../../objective/objective.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastService} from '../../../../shared/services/toast.service';
import {AccountService} from '../../../../accounting/account/account.service';
import {finalize} from 'rxjs/operators';
import {FinancialYearService} from '../../../../setup-and-configuration/cooperative/financial-year/financial-year.service';
import {FinancialYear} from '../../../../setup-and-configuration/cooperative/financial-year/financial-year';
import {PlanService} from '../plan.service';
import {Plan} from '../plan';

@Component({
  selector: 'app-copy',
  templateUrl: './copy.component.html',
  styleUrls: ['./copy.component.scss']
})
export class CopyComponent implements OnInit {
  loading: boolean;
  title: string;
  plan: Plan;
  financialYears: FinancialYear[];
  financialYearControl = new FormControl();

  constructor(
    private planService: PlanService,
    private financialYearService: FinancialYearService,
    private dialogRef: MatDialogRef<CopyComponent>,
    private toast: ToastService,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.loading = false;
    this.title = data.title;
    this.plan = data.plan;
  }

  ngOnInit(): void {
    this.loadFinancialYears();
  }

  loadFinancialYears(): void {
    this.financialYearService.currentAndFutureYears().subscribe(response => {
      this.financialYears = response.data;
    });
  }

  store(): void {
    const financialYear = this.financialYearControl.value as FinancialYear;
    this.loading = true;
    this.planService.copy(this.plan.id, financialYear)

      .subscribe(response => {
        this.dialogRef.close(response);
      }, error => {
        this.toast.error('Error', error.error.message);
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
