import {Component, OnInit, ViewChild} from '@angular/core';
import Swal from 'sweetalert2';
import {BehaviorSubject, Observable} from 'rxjs';
import {LiturgicalYear} from './liturgical-year';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {LiturgicalYearService} from './liturgical-year.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';

import {environment} from '../../../environments/environment.prod';
import {FormComponent} from './form/form.component';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {UntypedFormControl} from '@angular/forms';
import {ToastService} from "../../shared/services/toast.service";

@Component({
  selector: 'app-liturgical-year',
  templateUrl: './liturgical-year.component.html',
  styleUrls: ['./liturgical-year.component.scss']
})
export class LiturgicalYearComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'startDate', 'endDate', 'closed', 'current', 'planning', 'previous', 'manage'];
  page: number;
  size: number;
  perPageOptions = [];
  isLoading = false;
  totalItems: number;
  data: any;
  queryString: string;
  liturgicalYearListSubject: BehaviorSubject<LiturgicalYear[]> = new BehaviorSubject([]);
  searchControl = new UntypedFormControl();

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private liturgicalYearService: LiturgicalYearService,
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
    this.liturgicalYearService.getAll(queryString, page, size).subscribe((response) => {
      this.liturgicalYearListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getLiturgicalYears(): Observable<LiturgicalYear[]> {
    return this.liturgicalYearListSubject.asObservable();
  }

  form(year?: LiturgicalYear): void {
    this.data = {
      liturgicalYear: year ? year : undefined
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = this.data;
    const dl = this.dialog.open(FormComponent, dialogConfig);

    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        this.loadData(this.page, this.size, this.queryString);
        this.toast.success('Success!','Financial Year created successfully!');
      }
    });
  }

  delete(index, row): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.liturgicalYearService.delete(row.id)
          .subscribe((response) => {
            this.loadData(this.page, this.size, this.queryString);
            this.toast.success('Success!','Financial Year deleted successfully!');
          });
      }
    });
  }


  filter(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(value => this.liturgicalYearService.getAll(value, this.page, this.size)
          .pipe(finalize(() => (this.isLoading = false))))
      )
      .subscribe(response => {
        this.liturgicalYearListSubject.next(response.data.content);
        this.totalItems = response.data.totalElements;
      });
  }

  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    this.loadData(this.page, this.size, this.queryString);
  }

  activate(financialYear: LiturgicalYear): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Activate it!'
    }).then(result => {
      if (result.value) {
        this.liturgicalYearService.activate(financialYear).subscribe((response) => {
          this.loadData(this.page, this.size, this.queryString);
          this.toast.success('Success!','Financial Year activated successfully!');
        });
      }
    });
  }

  setPlanningYear(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Set Planning Year!'
    }).then(result => {
      if (result.value) {
        this.liturgicalYearService.setPlanningLiturgicalYear(id).subscribe((response) => {
          this.loadData(this.page, this.size, this.queryString);
          this.toast.success('Success!','Planning Year Set successfully!');
        });
      }
    });
  }
}
