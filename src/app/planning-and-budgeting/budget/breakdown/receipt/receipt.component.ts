import {Component, Inject, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';
import {ExpenditureService} from '../../../../income-and-expenditure/expenditure/expenditure.service';
import {ToastService} from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {
  id: number;
  type: string;
  fileSubject: BehaviorSubject<any> = new BehaviorSubject('');

  constructor(private dialogRef: MatDialogRef<ReceiptComponent>,
              private expenditureService: ExpenditureService,
              private sanitizer: DomSanitizer,
              private toastService: ToastService,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.id = data.id;
    this.type = data.type;
  }

  ngOnInit(): void {
    if (this.type === 'ITEM') {
      this.loadExpenditureItemReceipt(this.id);
    } else {
      this.loadExpenditureReceipt(this.id);
    }
  }

  getReceipt(): Observable<any> {
    return this.fileSubject.asObservable();
  }

  private loadExpenditureItemReceipt(id: number): void {
    this.expenditureService.expenditureItemReceipt(id).subscribe(response => {
      const file = this.sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + response.data);
      this.fileSubject.next(file);
    }, error => this.toastService.error('Error', error.error.message));
  }

  private loadExpenditureReceipt(id: number): void {
    this.expenditureService.expenditureReceipt(id).subscribe(response => {
      const file = this.sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + response.data);
      this.fileSubject.next(file);
    }, error => this.toastService.error('Error', error.error.message));
  }

  close(): void {
    this.dialogRef.close();
  }
}
