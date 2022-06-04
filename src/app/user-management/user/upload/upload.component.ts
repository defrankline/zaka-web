import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Division} from '../../../settings/division/division';
import * as excel from 'xlsx';
import {UserService} from '../user.service';
import Swal from 'sweetalert2';
import {User, UserUpload} from '../user';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {environment} from '../../../../environments/environment.prod';
import {saveAs} from 'file-saver';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {DivisionService} from '../../../settings/division/division.service';
import {FormControl, Validators} from '@angular/forms';

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
  divisions: Division[] | null = [];
  administrationDivisions: Division[] | null = [];
  members: User[] = [];
  worksheet: any;
  totalItems: number;
  page = environment.page;
  size = environment.size;
  divisionControl = new FormControl(null, [Validators.required]);
  administrativeDivisionControl = new FormControl(null, [Validators.required]);
  perPageOptions = environment.perPageOptions;
  displayedColumns: string[] = ['id', 'cardNumber', 'firstName', 'middleName', 'surname', 'gender', 'mobile'];
  dataSource = new MatTableDataSource<User>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private userService: UserService,
              private toast: ToastService,
              private divisionService: DivisionService,
              private templateService: TemplateService,
              private dialogRef: MatDialogRef<UploadComponent>,
              @Inject(MAT_DIALOG_DATA) private data) {
  }

  ngOnInit(): void {
    this.searchAdministrativeDivisions();
    this.searchDivisions();
  }

  close(): void {
    this.dialogRef.close();
  }

  searchDivisions(): void {
    this.divisionControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(value => this.divisionService.getAll(value, 0, 10).pipe(finalize(() => (this.isLoading = false))))
      )
      .subscribe(response => {
        this.divisions = response.data.content;
      });
  }

  searchAdministrativeDivisions(): void {
    this.administrativeDivisionControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(value => this.divisionService.getAll(value, 0, 10).pipe(finalize(() => (this.isLoading = false))))
      )
      .subscribe(response => {
        this.administrationDivisions = response.data.content;
      });
  }

  displayDivision(user: Division): string {
    if (user) {
      return user.number + ' - ' + user.name;
    } else {
      return '';
    }
  }

  displayAdministrativeDivision(user: Division): string {
    if (user) {
      return user.number + ' - ' + user.name;
    } else {
      return '';
    }
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
        mobile: row.mobile ? row.mobile.toLocaleString('fullwide', {useGrouping: false}) : '',
      } as User;
      items.push(item);
    });
    this.processData(items);
  }

  private processData(items: User[]): void {
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
          if (!row.firstName || !row.surname || !row.gender || !row.cardNumber) {
            errors.push(row);
          }
        });
        if (errors.length > 0) {
          this.toast.show('File has some blank fields, firstName, surname, gender, cardNumber cannot be blank');
        } else {
          const adminDivision = this.administrativeDivisionControl.value as Division;
          const admin = {
            id: adminDivision.id,
            name: adminDivision.name,
            number: adminDivision.number
          } as Division;

          const divisionValue = this.divisionControl.value as Division;
          const location = {
            id: divisionValue.id,
            name: divisionValue.name,
            number: divisionValue.number
          } as Division;
          const payload = {
            division: location,
            administrationDivision: admin,
            users: this.members
          } as UserUpload;
          this.store(payload);
        }
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  downloadUploadTemplate(): void {
    this.templateService.userUpload().subscribe(response => {
      saveAs(new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      ), 'user-upload-template.xlsx');
    });
  }

  store(userUpload: UserUpload): void {
    this.userService.upload(userUpload).subscribe(response => {
      this.dialogRef.close(response);
    });
  }
}
