import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {FormControl, Validators} from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {environment} from '../../../environments/environment.prod';
import Swal from 'sweetalert2';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {ITreeOptions} from '@circlon/angular-tree-component';
import {Division, DivisionTree} from '../../settings/division/division';
import {DivisionService} from '../../settings/division/division.service';
import {Router} from '@angular/router';
import {CustomResponse} from "../../shared/custom-response";
import {UploadComponent} from './upload/upload.component';
import {ContributionPayment} from './contribution-payment';
import {ContributionPaymentService} from './contribution-payment.service';
import {FormComponent} from './form/form.component';
import {saveAs} from 'file-saver';
import {DatePipe} from '@angular/common';
import {Contribution} from '../../settings/contribution-setup/contribution';
import {ContributionService} from '../../settings/contribution-setup/contribution.service';
import {ToastService} from "../../shared/services/toast.service";


@Component({
  selector: 'app-contribution-payment',
  templateUrl: './contribution-payment.component.html',
  styleUrls: ['./contribution-payment.component.scss']
})
export class ContributionPaymentComponent implements OnInit {
  page = environment.page;
  size = environment.size;
  totalItems = 0;
  dateFormat = 'yyyy-MM-dd';
  maxSize = environment.maxSize;
  perPageOptions = environment.perPageOptions;
  queryString = '_';
  startDateControl = new FormControl('', [Validators.required]);
  endDateControl = new FormControl('', [Validators.required]);
  itemListSubject: BehaviorSubject<ContributionPayment[]> = new BehaviorSubject([]);
  isLoading = false;
  searchControl = new FormControl('');
  contributionControl = new FormControl(null);
  products = '';
  contributions: Contribution[];
  start = '';
  end = '';
  options: ITreeOptions = {
    useCheckbox: false,
  };
  activatedHierarchy: Division;
  nodes: DivisionTree[];

  constructor(private contributionPaymentService: ContributionPaymentService,
              private toast: ToastService,
              private datePipe: DatePipe,
              private divisionService: DivisionService,
              private contributionService: ContributionService,
              private dialog: MatDialog,
              private router: Router) {
  }

  ngOnInit(): void {
    this.search();
    this.loadContributions();
    this.loadCurrentContributionPaymentAdministrativeTree();
  }

  loadContributions(): void {
    this.contributionService.getAll().subscribe(response => {
      this.contributions = response.data;
    });
  }

  loadCurrentContributionPaymentAdministrativeTree(): void {
    this.divisionService.getCurrentUserTree().subscribe(response => {
      this.nodes = response.data;
      this.activatedHierarchy = this.nodes[0];
      this.loadData(this.activatedHierarchy.id, this.queryString, this.page, this.size, this.start, this.end, this.products);
    });
  }

  select(event: any) {
    this.activatedHierarchy = event.node.data as Division;
    this.loadData(this.activatedHierarchy.id, this.queryString, this.page, this.size, this.start, this.end, this.products);
  }

  loadData(divisionId: number, query: string, page: number, size: number, startDate: string, endDate: string, contributions: string): void {
    this.contributionPaymentService.getAll(divisionId, query, page, size, startDate, endDate, contributions).subscribe((response) => {
      this.itemListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getItems(): Observable<ContributionPayment[]> {
    return this.itemListSubject.asObservable();
  }

  pageChanged(event: any): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.loadData(this.activatedHierarchy.id, this.queryString, this.page, this.size, this.start, this.end, this.products);
  }

  delete(user: ContributionPayment): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.contributionPaymentService.delete(user.id)
          .subscribe((response) => {
            this.loadData(this.activatedHierarchy.id, this.queryString, this.page, this.size, this.start, this.end, this.products);
            this.toast.success('Success!',response.message);
          });
      }
    });
  }

  createOrUpdate(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    const dl = this.dialog.open(FormComponent, dialogConfig);
    dl.afterClosed().subscribe((response: CustomResponse) => {
      if (response) {
        this.loadData(this.activatedHierarchy.id, this.queryString, this.page, this.size, this.start, this.end, this.products);
        this.toast.success('Success!',response.message);
      }
    });
  }

  search(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(value => this.contributionPaymentService.getAll(this.activatedHierarchy.id, value.toString(), this.page, this.size)
          .pipe(finalize(() => (this.isLoading = false))))
      )
      .subscribe(response => {
        this.itemListSubject.next(response.data.content);
        this.totalItems = response.data.totalElements;
      });
  }

  upload(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.data = {
      division: this.activatedHierarchy
    };
    const dl = this.dialog.open(UploadComponent, dialogConfig);
    dl.afterClosed().subscribe((response: CustomResponse) => {
      if (response) {
        this.loadData(this.activatedHierarchy.id, this.queryString, this.page, this.size, this.start, this.end, this.products);
        this.toast.success('Success!',response.message);
      }
    });
  }

  print(item: ContributionPayment): void {
    this.contributionPaymentService.printReceipt(item.id).subscribe(response => {
      saveAs(new Blob([response], {type: 'application/pdf'}), Date.now() + '-payment-receipt.pdf');
    }, error => this.toast.success('Success!','Error', error.error.message));
  }

  filterByDateRange(): void {
    if (this.startDateControl.value && this.endDateControl.value) {
      this.start = this.datePipe.transform(this.startDateControl.value, 'yyyy-MM-dd');
      this.end = this.datePipe.transform(this.endDateControl.value, 'yyyy-MM-dd');
      this.loadData(this.activatedHierarchy.id, this.queryString, this.page, this.size, this.start, this.end, this.products);
    } else {
      this.start = '';
      this.end = '';
      this.loadData(this.activatedHierarchy.id, this.queryString, this.page, this.size, this.start, this.end, this.products);
    }
  }

  filterByContributions(): void {
    if (this.contributionControl.value) {
      const arr = [];
      const products = this.contributionControl.value as Contribution[];
      products.map(row => {
        arr.push(row.id);
      });
      this.products = arr.join();
      if (this.startDateControl.value && this.endDateControl.value) {
        this.start = this.datePipe.transform(this.startDateControl.value, 'yyyy-MM-dd');
        this.end = this.datePipe.transform(this.endDateControl.value, 'yyyy-MM-dd');
      }
      this.loadData(this.activatedHierarchy.id, this.queryString, this.page, this.size, this.start, this.end, this.products);
    } else {
      this.products = '';
      this.loadData(this.activatedHierarchy.id, this.queryString, this.page, this.size, this.start, this.end, this.products);
    }
  }
}
