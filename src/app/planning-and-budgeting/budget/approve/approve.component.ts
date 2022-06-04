import {Component, Inject, OnInit} from '@angular/core';
import {Budget} from '../budget';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';
import {ToastService} from '../../../shared/services/toast.service';
import {FormControl, Validators} from '@angular/forms';
import {fromEvent, Observable} from 'rxjs';
import {pluck} from 'rxjs/operators';
import {BudgetService} from '../budget.service';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.scss']
})
export class ApproveComponent implements OnInit {
  budget: Budget;
  fileToUploadName: string;
  fileToUpload: string;
  registrarApprovalDocument: any;
  registrarApprovalDocumentControl = new FormControl(null, [Validators.required]);

  constructor(private dialogRef: MatDialogRef<ApproveComponent>,
              private budgetService: BudgetService,
              private sanitizer: DomSanitizer,
              private toastService: ToastService,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.budget = data.budget;
  }


  ngOnInit(): void {

  }

  onFileChange(event): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileToUploadName = file.name;
      this.registrarApprovalDocumentControl.setValue(file);
    }
  }

  fileToBase64(fileReader: FileReader, fileToRead: File): Observable<any> {
    fileReader.readAsDataURL(fileToRead);
    return fromEvent(fileReader, 'load').pipe(pluck('currentTarget', 'result'));
  }

  store(): void {
    const fileReader = new FileReader();
    const document = this.registrarApprovalDocumentControl.value;
    this.fileToBase64(fileReader, document).subscribe(base64image => {
      this.fileToUpload = base64image;
      const file = this.fileToUpload.toString().split(',')[1];
      this.upload(file);
    });
  }

  private upload(file: any): void {
    this.budgetService.approve(this.budget.id, file).subscribe((response) => {
      if (response.status === 201 || response.status === 200) {
        this.dialogRef.close(response);
      } else {
        this.toastService.error('Warning', response.message, 10000);
      }
    }, error => {
      this.toastService.error('Error', error.error.message, 10000);
    });
  }


  close(): void {
    this.dialogRef.close();
  }
}
