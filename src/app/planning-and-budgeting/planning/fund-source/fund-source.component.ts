import {Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FormControl} from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {ApiConfig} from '../../../shared';
import {FormComponent} from './form/form.component';
import Swal from 'sweetalert2';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {FundSource} from './fund-source';
import {FundSourceService} from './fund-source.service';


@Component({
  selector: 'app-fund-source',
  templateUrl: './fund-source.component.html',
  styleUrls: ['./fund-source.component.scss']
})
export class FundSourceComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'description', 'manage'];
  page: number;
  size: number;
  perPageOptions = [];
  totalItems: number;
  queryString: string;
  private itemListSubject: BehaviorSubject<FundSource[]> = new BehaviorSubject(null);
  formResponseSubscription: Subscription;
  getAllPagedSubscription: Subscription;
  deleteSubscription: Subscription;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  searchControl = new FormControl('');
  isLoading = false;

  constructor(
    private fundSourceService: FundSourceService,
    private dialog: MatDialog,
    private toast: ToastrService
  ) {
    this.page = ApiConfig.page;
    this.size = ApiConfig.size;
    this.queryString = '_';
    this.perPageOptions = ApiConfig.perPageOptions;
  }

  ngOnInit(): void {
    this.loadData(this.page, this.size, this.queryString);
    this.filter();
  }

  loadData(page: number, size: number, query: string): void {
    this.getAllPagedSubscription = this.fundSourceService.getAll(query, page, size).subscribe((response) => {
      this.itemListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getFundSources(): Observable<FundSource[]> {
    return this.itemListSubject.asObservable();
  }

  form(row?: FundSource): void {
    const data = {
      title: 'Fund Source Form',
      fundSource: row ? row : undefined
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.data = data;
    const dl = this.dialog.open(FormComponent, dialogConfig);

    this.formResponseSubscription = dl.afterClosed().subscribe((response: any) => {
      if (response) {
        this.loadData(this.page, this.size, this.queryString);
        this.toast.success('Fund Source ' + row ? 'Updated' : 'Created' + ' Successfully', 'Success', {
          timeOut: 5000
        });
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
        this.deleteSubscription = this.fundSourceService.delete(row.id)
          .subscribe((response) => {
            this.loadData(this.page, this.size, this.queryString);
            this.toast.success('Fund Source deleted successfully!', 'Success!', {
              timeOut: 5000
            });
          });
      }
    });
  }


  filter(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(value => this.fundSourceService.getAll(value, this.page, this.size,)
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
