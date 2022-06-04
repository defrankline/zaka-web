import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';
import {FormControl, Validators} from '@angular/forms';
import {Plan} from '../plan';
import {PlanService} from '../plan.service';
import {ToastService} from '../../../../shared/services/toast.service';
import {RejectDto} from '../../../../shared/reject-dto';

@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.scss']
})
export class ResponseComponent implements OnInit {
  plan: Plan;
  responseControl = new FormControl('', [Validators.required]);

  constructor(private dialogRef: MatDialogRef<ResponseComponent>,
              private planService: PlanService,
              private sanitizer: DomSanitizer,
              private toastService: ToastService,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.plan = data.plan;
  }


  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

  send(): void {
    const payload = {
      id: this.plan.id,
      message: this.responseControl.value as string
    } as RejectDto;
    if (this.plan.approvalStage.code === '20') {
      this.planService.sendBackToCommittee(payload).subscribe(response => {
        if (response.status === 201) {
          this.dialogRef.close(response);
        } else {
          this.toastService.error('Error', response.message);
        }
      }, error => this.toastService.error('Error', error.error.message));
    } else {
      this.planService.sendBackToDco(payload).subscribe(response => {
        if (response.status === 201) {
          this.dialogRef.close(response);
        } else {
          this.toastService.error('Error', response.message);
        }
      }, error => this.toastService.error('Error', error.error.message));
    }
  }

}
