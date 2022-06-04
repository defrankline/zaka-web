import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Recipient} from './recipient';
import {RecipientService} from './recipient.service';
import {Sms} from '../sms';
import Swal from 'sweetalert2';
import {SmsService} from '../sms.service';
import {ValidMobileNumberCountDto} from '../valid-mobile-number-count-dto';
import {Division} from '../../../settings/division/division';
import {DivisionService} from '../../../settings/division/division.service';
import {environment} from '../../../../environments/environment.prod';
import {ToastService} from "../../../shared/services/toast.service";

@Component({
  selector: 'app-recipient',
  templateUrl: './recipient.component.html',
  styleUrls: ['./recipient.component.scss']
})
export class RecipientComponent implements OnInit {
  displayedColumns: string[] = ['id', 'member', 'mobile', /*'delivery',*/ 'status'];
  page: number;
  size: number;
  perPageOptions = [];
  totalItems: number;
  company: Division;
  sms: Sms;
  recipientListSubject: BehaviorSubject<Recipient[]> = new BehaviorSubject([]);
  validMobileNumberCount: ValidMobileNumberCountDto;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private recipientService: RecipientService,
    private dialog: MatDialog,
    private toast: ToastService,
    private smsService: SmsService,
    private companyService: DivisionService,
    private dialogRef: MatDialogRef<RecipientComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.sms = data.sms;
    this.page = environment.page;
    this.size = environment.size;
    this.perPageOptions = environment.perPageOptions;
  }

  ngOnInit(): void {
    this.loadData(this.page, this.size);
    this.loadCurrentCompany();
  }

  loadData(page: number, size: number): void {
    this.recipientService.getAllPaged(this.sms.id, page, size).subscribe((response) => {
      this.recipientListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
      this.validMobileNumberCount = response.other;
    });
  }

  loadCurrentCompany(): void {
    this.companyService.getCurrentUserAdminDivision().subscribe(response => {
      this.company = response.data;
    });
  }

  getRecipients(): Observable<Recipient[]> {
    return this.recipientListSubject.asObservable();
  }

  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    this.loadData(this.page, this.size);
  }

  close(): void {
    this.dialogRef.close();
  }

  validMobileNumber(mobile: string): boolean {
    return mobile.length === 12;
  }

  publish(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!', showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, publish it!'
    }).then(result => {
      if (result.value) {
        this.smsService.publish(this.sms.id).subscribe((response) => {
          this.dialogRef.close(response);
        }, error => this.toast.success('Success!',error.error.message));
      }
    });
  }
}
