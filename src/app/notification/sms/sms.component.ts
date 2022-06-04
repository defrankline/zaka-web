import {Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import {Sms} from './sms';
import {SmsService} from './sms.service';
import {FormComponent} from './form/form.component';
import {RecipientComponent} from './recipient/recipient.component';
import {Division} from '../../settings/division/division';
import {DivisionService} from '../../settings/division/division.service';
import {environment} from '../../../environments/environment.prod';
import {FormControl} from '@angular/forms';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {ToastService} from "../../shared/services/toast.service";

@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.scss']
})
export class SmsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'message', 'category', 'timeSent', 'status', 'manage'];
  page: number;
  size: number;
  perPageOptions = [];
  totalItems: number;
  data: any;
  queryString: string;
  company: Division;
  smsListSubject: BehaviorSubject<Sms[]> = new BehaviorSubject(null);
  searchControl = new FormControl('');
  query = '_';
  isLoading = false;

  constructor(
    private smsService: SmsService,
    private dialog: MatDialog,
    private toast: ToastService,
    private companyService: DivisionService,
  ) {
    this.page = environment.page;
    this.size = environment.size;
    this.queryString = '_';
    this.perPageOptions = environment.perPageOptions;
  }

  ngOnInit(): void {
    this.loadData(this.query, this.page, this.size);
    this.loadCurrentCompany();
    this.filter();
  }

  loadCurrentCompany(): void {
    this.companyService.getCurrentUserAdminDivision().subscribe(response => {
      this.company = response.data;
    });
  }

  loadData(query: string, page: number, size: number): void {
    this.smsService.getAll(query, page, size).subscribe((response) => {
      this.smsListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    this.loadData(this.query, this.page, this.size);
  }

  getTexts(): Observable<Sms[]> {
    return this.smsListSubject.asObservable();
  }

  create(): void {
    const data = {
      title: 'Create SMS',
      action: 'create'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = data;
    const dl = this.dialog.open(FormComponent, dialogConfig);
    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        this.loadData(this.query, this.page, this.size);
        this.toast.success('Success!','SMS created successfully!');
      }
    });
  }

  edit(index: number, row: Sms): void {
    const data = {
      title: 'Update SMS',
      action: 'update',
      sms: row,
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = data;
    const dl = this.dialog.open(FormComponent, dialogConfig);
    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        this.loadData(this.query, this.page, this.size);
        this.toast.success('Success!','SMS updated successfully!');
      }
    });
  }

  delete(index: number, row: Sms): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.smsService.delete(row.id)
          .subscribe((response) => {
            this.loadData(this.query, this.page, this.size);
            this.toast.success('Success!','SMS deleted successfully!');
          });
      }
    });
  }

  publish(row: Sms): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, publish it!'
    }).then(result => {
      if (result.value) {
        this.smsService.publish(row.id).subscribe((response) => {
          this.loadData(this.query, this.page, this.size);
          this.toast.success('Success!','SMS Published Successfully!');
        }, error => this.toast.success('Success!',error.error.message));
      }
    });
  }

  filter(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(value => this.smsService.getAll(value, this.page, this.size)
          .pipe(finalize(() => (this.isLoading = false))))
      )
      .subscribe(response => {
        this.smsListSubject.next(response.data.content);
        this.totalItems = response.data.totalElements;
      });
  }

  recipients(row: Sms): void {
    const data = {
      title: 'SMS Recipients',
      sms: row,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = data;
    const dl = this.dialog.open(RecipientComponent, dialogConfig);
    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        if (response.status === 200) {
          this.loadData(this.query, this.page, this.size);
          this.toast.success('Success!','SMS Published Successfully!');
        } else {
          this.toast.success('Success!',response.message);
        }
      }
    }, error => this.toast.success('Success!',error.error.message));
  }

  resend(row: Sms): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Send it again!'
    }).then(result => {
      if (result.value) {
        this.smsService.publish(row.id).subscribe((response) => {
          this.loadData(this.query, this.page, this.size);
          this.toast.success('Success!','SMS Sent Successfully!');
        }, error => this.toast.success('Success!',error.error.message));
      }
    });
  }
}
