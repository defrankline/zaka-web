import {Component, Inject, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';
import {Plan} from '../plan';
import {PlanService} from '../plan.service';
import {ToastService} from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-committee-document',
  templateUrl: './committee-document.component.html',
  styleUrls: ['./committee-document.component.scss']
})
export class CommitteeDocumentComponent implements OnInit {
  plan: Plan;
  fileSubject: BehaviorSubject<any> = new BehaviorSubject('');

  constructor(private dialogRef: MatDialogRef<CommitteeDocumentComponent>,
              private planService: PlanService,
              private sanitizer: DomSanitizer,
              private toastService: ToastService,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.plan = data.plan;
  }

  ngOnInit(): void {
    if (this.plan.boardApprovalDocument) {
      this.loadDocument(this.plan.id);
    } else {
      this.toastService.warning('Not found', 'No document uploaded yet');
    }
  }

  getUploadedContract(): Observable<any> {
    return this.fileSubject.asObservable();
  }

  private loadDocument(id: number): void {
    this.planService.committeeDocument(id).subscribe(response => {
      const file = this.sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + response.data);
      this.fileSubject.next(file);
    }, error => this.toastService.error('Error', error.error.message));
  }

  close(): void {
    this.dialogRef.close();
  }
}
