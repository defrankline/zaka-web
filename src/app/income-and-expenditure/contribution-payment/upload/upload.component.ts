import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import * as excel from 'xlsx';
import {MatTableDataSource} from '@angular/material/table';
import Swal from 'sweetalert2';
import {saveAs} from 'file-saver';
import {DatePipe} from '@angular/common';
import {ContributionPaymentUploadDto, ContributionPaymentUploadItemDto} from '../contribution-payment';
import {ToastService} from "../../../shared/services/toast.service";
import {ContributionPaymentService} from '../contribution-payment.service';
import {TemplateService} from "../../../shared/services/template.service";


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  fileUploaded: File;
  products: ContributionPaymentUploadItemDto[] = [];
  storeData: any;
  jsonData: any;
  worksheet: any;
  isLoading = false;
  totalItems: number;
  displayedColumns: string[] = ['id', 'cardNumber', 'amount', 'itemCode', 'date', 'intendedDate', 'pvn', 'paymentMethodCode'];
  dataSource = new MatTableDataSource<ContributionPaymentUploadItemDto>();


  constructor(private toast: ToastService,
              private templateService: TemplateService,
              private contributionPaymentService: ContributionPaymentService,
              private datePipe: DatePipe,
              private dialogRef: MatDialogRef<UploadComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any) {
  }

  ngOnInit(): void {

  }

  close(): void {
    this.dialogRef.close();
  }

  uploadedFile(event): void {
    this.fileUploaded = event.target.files[0];
    this.readExcel();
  }

  readExcel(): void {
    const readFile = new FileReader();
    readFile.onload = (e) => {
      this.storeData = readFile.result;
      const data = new Uint8Array(this.storeData);
      const arr = [];
      for (let i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const dataString = arr.join('');
      const workbook = excel.read(dataString, {type: 'binary'});
      const firstSheetName = workbook.SheetNames[0];
      this.worksheet = workbook.Sheets[firstSheetName];
    };
    readFile.readAsArrayBuffer(this.fileUploaded);
  }

  preview(): void {
    const items = [];
    this.jsonData = excel.utils.sheet_to_json(this.worksheet, {raw: false});
    this.jsonData.forEach(row => {
      if (Number(row.amount) > 0) {
        const item = {
          paymentVoucherNumber: row.paymentVoucherNumber ? row.paymentVoucherNumber : null,
          amount: Number(row.amount),
          date: this.datePipe.transform(row.date ? row.date : Date.now(), 'yyyy-MM-dd').toString(),
          intendedDate: this.datePipe.transform(row.intendedDate ? row.intendedDate : Date.now(), 'yyyy-MM-dd').toString(),
          itemCode: row.itemCode,
          paymentMethodCode: row.paymentMethodCode,
          cardNumber: row.cardNumber
        } as ContributionPaymentUploadItemDto;
        items.push(item);
      }
    });
    this.dataSource.data = items;
    this.products = items;
  }

  upload(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Do it!'
    }).then(result => {
      if (result.value) {
        const errors = [];
        this.products.forEach(row => {
          if (!row.cardNumber || !row.amount || !row.itemCode || !row.date || !row.paymentMethodCode || !row.intendedDate) {
            errors.push(row);
          }
        });
        if (errors.length > 0) {
          console.log(errors);
          this.toast.success('Success!', 'File has some blank fields: cardNumber, amount, date, intendedDate, itemCode, paymentMethodCode cannot be blank');
        } else {
          const payload = {
            items: this.products,
          } as ContributionPaymentUploadDto;
          this.store(payload);
        }
      }
    });
  }

  store(contributionPaymentUploadDto: ContributionPaymentUploadDto): void {
    this.contributionPaymentService.upload(contributionPaymentUploadDto).subscribe(response => {
      this.dialogRef.close(response);
    }, error => {
      this.toast.success('Success!', 'Payment Could Not be Uploaded!');
    });
  }

  total(): number {
    let total = 0;
    const items = this.products;
    items.map(row => {
      total = total + row.amount;
    });
    return total;
  }

  downloadUploadTemplate(): void {
    this.templateService.contributionPaymentUpload().subscribe(response => {
      saveAs(new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      ), 'contribution-payment-upload-template.xlsx');
    });
  }
}
