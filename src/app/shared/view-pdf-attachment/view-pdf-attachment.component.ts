import {Component, Inject, OnInit} from '@angular/core';
import {LoanCollateral} from '../../loan-management/loan/loan-collateral/loan-collateral';
import {LoanCollateralService} from '../../loan-management/loan/loan-collateral/loan-collateral.service';
import {ToastrService} from 'ngx-toastr';
import {DomSanitizer} from '@angular/platform-browser';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-view-pdf-attachment',
  templateUrl: './view-pdf-attachment.component.html',
  styleUrls: ['./view-pdf-attachment.component.scss']
})
export class ViewPdfAttachmentComponent implements OnInit {
  attachment: any;
  base64: any;

  constructor(
    private loanCollateralService: LoanCollateralService,
    private toast: ToastrService,
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<ViewPdfAttachmentComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.base64 = data.base64;
  }

  ngOnInit(): void {
    this.loadAttachment();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  loadAttachment(): void {
    this.attachment = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.base64);
  }

  print(): void {
  }
}
