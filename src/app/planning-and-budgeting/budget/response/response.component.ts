import {Component, Inject, OnInit} from '@angular/core';
import {Budget} from '../budget';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BudgetService} from '../budget.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ToastService} from '../../../shared/services/toast.service';
import {FormControl, Validators} from '@angular/forms';
import {RejectDto} from '../../../shared/reject-dto';

@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.scss']
})
export class ResponseComponent implements OnInit {
  budget: Budget;
  responseControl = new FormControl('', [Validators.required]);

  constructor(private dialogRef: MatDialogRef<ResponseComponent>,
              private budgetService: BudgetService,
              private sanitizer: DomSanitizer,
              private toastService: ToastService,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.budget = data.budget;
  }


  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

  send(): void {
    const payload = {
      id: this.budget.id,
      message: this.responseControl.value as string
    } as RejectDto;
    if (this.budget.approvalStage.code === '20') {
      this.budgetService.sendBackToCommittee(payload).subscribe(response => {
        if (response.status === 201) {
          this.dialogRef.close(response);
        } else {
          this.toastService.error('Error', response.message);
        }
      }, error => this.toastService.error('Error', error.error.message));
    } else {
      this.budgetService.sendBackToDco(payload).subscribe(response => {
        if (response.status === 201) {
          this.dialogRef.close(response);
        } else {
          this.toastService.error('Error', response.message);
        }
      }, error => this.toastService.error('Error', error.error.message));
    }
  }

}
