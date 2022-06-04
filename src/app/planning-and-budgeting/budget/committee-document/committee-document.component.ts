import {Component, Inject, OnInit} from '@angular/core';
import {Budget} from '../budget';
import {BehaviorSubject, Observable} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';
import {ToastService} from '../../../shared/services/toast.service';
import {BudgetService} from '../budget.service';

@Component({
  selector: 'app-committee-document',
  templateUrl: './committee-document.component.html',
  styleUrls: ['./committee-document.component.scss']
})
export class CommitteeDocumentComponent implements OnInit {
  budget: Budget;
  fileSubject: BehaviorSubject<any> = new BehaviorSubject('');

  constructor(private dialogRef: MatDialogRef<CommitteeDocumentComponent>,
              private budgetService: BudgetService,
              private sanitizer: DomSanitizer,
              private toastService: ToastService,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.budget = data.budget;
  }

  ngOnInit(): void {
    if (this.budget.boardApprovalDocument) {
      this.loadDocument(this.budget.id);
    } else {
      this.toastService.warning('Not found', 'No document uploaded yet');
    }
  }

  getUploadedContract(): Observable<any> {
    return this.fileSubject.asObservable();
  }

  private loadDocument(id: number): void {
    this.budgetService.committeeDocument(id).subscribe(response => {
      const file = this.sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + response.data);
      this.fileSubject.next(file);
    }, error => this.toastService.error('Error', error.error.message));
  }

  close(): void {
    this.dialogRef.close();
  }
}
