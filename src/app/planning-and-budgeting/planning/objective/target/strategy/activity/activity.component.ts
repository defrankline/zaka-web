import {Component, Inject, OnInit} from '@angular/core';
import {ApiConfig} from '../../../../../../shared';
import {BehaviorSubject, Observable} from 'rxjs';
import {Strategy} from '../../../../strategy/strategy';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {ToastService} from '../../../../../../shared/services/toast.service';
import {FormBuilder} from '@angular/forms';
import Swal from 'sweetalert2';
import {Activity} from '../../../../activity/activity';
import {ActivityService} from '../../../../activity/activity.service';
import {FormComponent} from './form/form.component';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  strategy: Strategy;
  public displayedColumns: string[] = ['id', 'code', 'description', 'fundSource', 'implementationIndicator', 'input',
    'projection', 'manage'];
  page = ApiConfig.page;
  size = ApiConfig.size;
  perPageOptions = ApiConfig.perPageOptions;
  totalItems = 0;
  private activityListSubject: BehaviorSubject<Activity[]> = new BehaviorSubject([]);

  constructor(private activityService: ActivityService,
              private dialogRef: MatDialogRef<ActivityComponent>,
              private toast: ToastService,
              private dialog: MatDialog,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.strategy = data.strategy;
  }

  ngOnInit(): void {
    this.loadData(this.strategy.id, this.page, this.size);
  }

  close(): void {
    this.dialogRef.close();
  }

  loadData(strategyId: number, page: number, size: number): void {
    this.activityService.getAll(page, size, strategyId).subscribe((response) => {
      this.activityListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getItems(): Observable<Activity[]> {
    return this.activityListSubject.asObservable();
  }

  form(row?: Activity): void {
    const data = {
      activity: row ? row : undefined,
      strategy: this.strategy
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = data;
    const dl = this.dialog.open(FormComponent, dialogConfig);
    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        this.loadData(this.strategy.id, this.page, this.size);
        this.toast.success('Success', 'Activity created successfully!');
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
        this.activityService.delete(row.id)
          .subscribe((response) => {
            this.loadData(this.strategy.id, this.page, this.size);
            this.toast.success('Success!', 'Activity deleted successfully!');
          });
      }
    });
  }

  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    this.loadData(this.strategy.id, this.page, this.size);
  }
}
