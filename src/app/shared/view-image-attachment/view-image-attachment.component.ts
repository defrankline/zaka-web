import {Component, Inject, OnInit} from '@angular/core';
import {LoanCollateral} from '../../loan-management/loan/loan-collateral/loan-collateral';
import {LoanCollateralService} from '../../loan-management/loan/loan-collateral/loan-collateral.service';
import {ToastrService} from 'ngx-toastr';
import {DomSanitizer} from '@angular/platform-browser';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-view-image-attachment',
  templateUrl: './view-image-attachment.component.html',
  styleUrls: ['./view-image-attachment.component.scss']
})
export class ViewImageAttachmentComponent implements OnInit {

  attachment: any;
  loanCollateral: LoanCollateral;

  constructor(
    private loanCollateralService: LoanCollateralService,
    private toast: ToastrService,
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<ViewImageAttachmentComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.loanCollateral = data.loanCollateral;
  }

  ngOnInit(): void {
    this.loadAttachment();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  loadAttachment(): void {
    this.loanCollateralService.attachment(this.loanCollateral.id).subscribe((response) => {
      const image = response.data;
      this.attachment = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + image);
    }, error => {
      this.toast.error('Attachment Could Not be Loaded!', 'Error', {
        timeOut: 5000
      });
    });
  }

  print(): void {
  }
}
