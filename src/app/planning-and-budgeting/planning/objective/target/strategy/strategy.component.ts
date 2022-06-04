import {Component, Inject, OnInit} from '@angular/core';
import {ApiConfig} from '../../../../../shared';
import {BehaviorSubject, Observable} from 'rxjs';
import {Target} from '../../../target/target';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {ToastService} from '../../../../../shared/services/toast.service';
import {FormBuilder} from '@angular/forms';
import Swal from 'sweetalert2';
import {Strategy} from '../../../strategy/strategy';
import {StrategyService} from '../../../strategy/strategy.service';
import {FormComponent} from './form/form.component';
import {ActivityComponent} from './activity/activity.component';

@Component({
  selector: 'app-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.scss']
})
export class StrategyComponent implements OnInit {
  target: Target;
  public displayedColumns: string[] = ['id', 'code', 'description', 'manage'];
  page = ApiConfig.page;
  size = ApiConfig.size;
  perPageOptions = ApiConfig.perPageOptions;
  totalItems = 0;
  private targetListSubject: BehaviorSubject<Strategy[]> = new BehaviorSubject([]);

  constructor(private strategyService: StrategyService,
              private dialogRef: MatDialogRef<StrategyComponent>,
              private toast: ToastService,
              private dialog: MatDialog,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.target = data.target;
  }

  ngOnInit(): void {
    this.loadData(this.target.id, this.page, this.size);
  }

  close(): void {
    this.dialogRef.close();
  }

  loadData(targetId: number, page: number, size: number): void {
    this.strategyService.getAll(page, size,targetId).subscribe((response) => {
      this.targetListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getItems(): Observable<Strategy[]> {
    return this.targetListSubject.asObservable();
  }

  form(row?: Strategy): void {
    const data = {
      strategy: row ? row : undefined,
      target: this.target
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = data;
    const dl = this.dialog.open(FormComponent, dialogConfig);
    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        this.loadData(this.target.id, this.page, this.size);
        this.toast.success('Success', 'Strategy created successfully!');
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
        this.strategyService.delete(row.id)
          .subscribe((response) => {
            this.loadData(this.target.id, this.page, this.size);
            this.toast.success('Success!', 'Strategy deleted successfully!');
          });
      }
    });
  }

  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    this.loadData(this.target.id, this.page, this.size);
  }

  activities(row: Strategy): void {
    const data = {
      strategy: row
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    dialogConfig.data = data;
    this.dialog.open(ActivityComponent, dialogConfig);
  }
}
