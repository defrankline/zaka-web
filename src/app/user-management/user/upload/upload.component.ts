import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Division} from '../../../settings/division/division';
import * as excel from 'xlsx';
import {UserService} from '../user.service';
import Swal from 'sweetalert2';
import {UserUploadItem} from '../user';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {environment} from '../../../../environments/environment.prod';
import {saveAs} from 'file-saver';
import {DivisionService} from '../../../settings/division/division.service';
import {ToastService} from "../../../shared/services/toast.service";
import {TemplateService} from "../../../shared/services/template.service";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  storeData: any;
  jsonData: any;
  fileUploaded: File;
  isLoading = false;
  members: UserUploadItem[] = [];
  worksheet: any;
  totalItems: number;
  page = environment.page;
  size = environment.size;
  perPageOptions = environment.perPageOptions;
  displayedColumns: string[] = ['id', 'cardNumber', 'firstName', 'middleName', 'surname', 'gender', 'mobile', 'location'];
  dataSource = new MatTableDataSource<UserUploadItem>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private userService: UserService,
              private toast: ToastService,
              private divisionService: DivisionService,
              private templateService: TemplateService,
              private dialogRef: MatDialogRef<UploadComponent>,
              @Inject(MAT_DIALOG_DATA) private data) {
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
    this.jsonData = excel.utils.sheet_to_json(this.worksheet, {raw: true});
    this.jsonData.forEach(row => {
      const item = {
        firstName: row.firstName.toString(),
        middleName: row.middleName ? row.middleName.toString() : '-',
        surname: row.surname.toString(),
        gender: row.gender.toString(),
        cardNumber: row.cardNumber.toString(),
        locationCode: row.locationCode.toString(),
        mobile: row.mobile ? row.mobile.toLocaleString('fullwide', {useGrouping: false}) : '',
      } as UserUploadItem;
      items.push(item);
    });
    this.processData(items);
  }

  private processData(items: UserUploadItem[]): void {
    this.dataSource = new MatTableDataSource(items);
    this.members = items;
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
        this.members.forEach(row => {
          if (!row.firstName || !row.surname || !row.gender || !row.cardNumber || !row.locationCode) {
            errors.push(row);
          }
        });
        if (errors.length > 0) {
          this.toast.success('Success!', 'File has some blank fields, firstName, surname, gender, cardNumber,locationCode cannot be blank');
        } else {
          this.store(this.members);
        }
      }
    });
  }

  downloadUploadTemplate(): void {
    this.templateService.userUpload().subscribe(response => {
      saveAs(new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      ), 'user-upload-template.xlsx');
    });
  }

  store(users: UserUploadItem[]): void {
    this.userService.upload(users).subscribe(response => {
      this.dialogRef.close(response);
    });
  }
}
