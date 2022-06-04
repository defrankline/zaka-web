import {Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import {ReminderCategory} from './reminder-category';
import {ReminderCategoryService} from './reminder-category.service';
import {FormComponent} from './form/form.component';
import {environment} from '../../../environments/environment.prod';
import {ToastService} from '../../utils/toast';

@Component({
  selector: 'app-reminder-category',
  templateUrl: './reminder-category.component.html',
  styleUrls: ['./reminder-category.component.scss']
})
export class ReminderCategoryComponent implements OnInit {
  displayedColumns: string[] = ['id', 'code', 'name', 'manage'];
  page: number;
  size: number;
  perPageOptions = [];
  totalItems: number;
  queryString: string;
  reminderCategoryListSubject: BehaviorSubject<ReminderCategory[]> = new BehaviorSubject([]);

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private reminderCategoryService: ReminderCategoryService,
    private dialog: MatDialog,
    private toast: ToastService
  ) {
    this.page = environment.page;
    this.size = environment.size;
    this.queryString = '_';
    this.perPageOptions = environment.perPageOptions;
  }

  ngOnInit(): void {
    this.loadData(this.page, this.size);
  }

  loadData(page: number, size: number): void {
    this.reminderCategoryService.getAll(page, size).subscribe((response) => {
      this.reminderCategoryListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getReminderCategories(): Observable<ReminderCategory[]> {
    return this.reminderCategoryListSubject.asObservable();
  }

  create(): void {
    const data = {
      title: 'Create Reminder Category',
      action: 'create'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = data;
    const dl = this.dialog.open(FormComponent, dialogConfig);

    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        const items = this.reminderCategoryListSubject.getValue();
        items.push(response.data);
        this.toast.show('Reminder Category created successfully!');
      }
    });
  }

  edit(index: number, reminderCategory: ReminderCategory): void {
    const data = {
      title: 'Update Reminder Category',
      action: 'update',
      reminderCategory,
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = data;
    const dl = this.dialog.open(FormComponent, dialogConfig);
    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        const items = this.reminderCategoryListSubject.getValue();
        items[index] = response.data;
        this.toast.show('Reminder Category updated successfully!');
      }
    });
  }

  delete(index: number, row: ReminderCategory): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.reminderCategoryService.delete(row.id)
          .subscribe((response) => {
            const items = this.reminderCategoryListSubject.getValue();
            items.splice(index, 1);
            this.toast.show('Reminder Category deleted successfully!');
          });
      }
    });
  }


  filter(query: string): void {
    this.queryString = query;
    if (query.length > 2 || query.length === 0) {
      this.loadData(this.page, this.size);
    }
  }

  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    this.loadData(this.page, this.size);
  }
}
