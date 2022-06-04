import {Component, Inject, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {DomSanitizer} from '@angular/platform-browser';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SavingService} from '../../savings-and-deposits/saving/saving.service';

@Component({
  selector: 'app-receipt-view-attachment-viewer',
  templateUrl: './view-attachment.component.html',
  styleUrls: ['./view-attachment.component.scss']
})
export class ViewAttachmentComponent implements OnInit {
  attachment: any;
  base64Content: any;
  mimeType: string;
  title: string;

  constructor(
    private savingService: SavingService,
    private toast: ToastrService,
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<ViewAttachmentComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) {
    this.base64Content = data.base64Content;
    this.mimeType = data.mimeType;
    this.title = data.title;
  }

  ngOnInit(): void {
    this.loadAttachment();
  }

  close(): void {
    this.dialogRef.close();
  }

  loadAttachment(): void {
    if (this.mimeType === 'pdf') {
      this.mimeType = 'pdf';
      this.attachment = this.sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + this.base64Content);
    } else {
      this.mimeType = 'jpg';
      this.attachment = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.base64Content);
    }
  }
}
