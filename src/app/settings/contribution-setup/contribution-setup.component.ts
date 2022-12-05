import {Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {UntypedFormControl} from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';

import {environment} from '../../../environments/environment.prod';
import {FormComponent} from './form/form.component';
import Swal from 'sweetalert2';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {Contribution} from './contribution';
import {ContributionService} from './contribution.service';
import {ToastService} from "../../shared/services/toast.service";

@Component({
  selector: 'app-contribution-setup',
  templateUrl: './contribution-setup.component.html',
  styleUrls: ['./contribution-setup.component.scss']
})
export class ContributionSetupComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'number', 'gfsCode', 'minAmount', 'startDate', 'endDate', 'year', 'manage'];
  page: number;
  size: number;
  perPageOptions = [];
  totalItems: number;
  queryString: string;
  itemListSubject: BehaviorSubject<Contribution[]> = new BehaviorSubject([]);

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  searchControl = new UntypedFormControl('');
  isLoading = false;
  type = 'ALL';

  constructor(
    private contributionService: ContributionService,
    private dialog: MatDialog,
    private toast: ToastService
  ) {
    this.page = environment.page;
    this.size = environment.size;
    this.queryString = '_';
    this.perPageOptions = environment.perPageOptions;
  }

  ngOnInit(): void {
    this.loadData(this.page, this.size, this.queryString);
    this.filter();
  }

  loadData(page: number, size: number, queryString: string): void {
    this.contributionService.getAll(queryString, page, size).subscribe((response) => {
      this.itemListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getContributions(): Observable<Contribution[]> {
    return this.itemListSubject.asObservable();
  }

  form(row?: Contribution): void {
    const data = {
      contribution: row ? row : undefined
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = data;
    const dl = this.dialog.open(FormComponent, dialogConfig);

    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        this.loadData(this.page, this.size, this.queryString);
        this.toast.success('Success!','Contribution Saved successfully!');
      }
    });
  }

  delete(row: Contribution): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.contributionService.delete(row.id)
          .subscribe((response) => {
            this.loadData(this.page, this.size, this.queryString);
            this.toast.success('Success!','Contribution deleted successfully!');
          });
      }
    });
  }


  filter(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(value => this.contributionService.getAll(value, this.page, this.size)
          .pipe(finalize(() => (this.isLoading = false))))
      )
      .subscribe(response => {
        this.itemListSubject.next(response.data.content);
        this.totalItems = response.data.totalElements;
      });
  }

  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    this.loadData(this.page, this.size, this.queryString);
  }
}
