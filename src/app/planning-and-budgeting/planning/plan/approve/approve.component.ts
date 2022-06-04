import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';
import {FormControl, Validators} from '@angular/forms';
import {fromEvent, Observable} from 'rxjs';
import {pluck} from 'rxjs/operators';
import {Plan} from '../plan';
import {PlanService} from '../plan.service';
import {ToastService} from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.scss']
})
export class ApproveComponent implements OnInit {
  plan: Plan;
  fileToUploadName: string;
  fileToUpload: string;
  registrarApprovalDocument: any;
  registrarApprovalDocumentControl = new FormControl(null, [Validators.required]);

  constructor(private dialogRef: MatDialogRef<ApproveComponent>,
              private planService: PlanService,
              private sanitizer: DomSanitizer,
              private toastService: ToastService,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.plan = data.plan;
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
    this.planService.approve(this.plan.id, file).subscribe((response) => {
      this.dialogRef.close(response);
    }, error => {
      this.toastService.error('Error', error.error.message, 10000);
    });
  }


  close(): void {
    this.dialogRef.close();
  }
}
