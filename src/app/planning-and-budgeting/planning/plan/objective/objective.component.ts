import {Component, Inject, OnInit} from '@angular/core';
import {ApiConfig} from '../../../../shared';
import {BehaviorSubject, Observable} from 'rxjs';
import {Objective} from '../../objective/objective';
import {ObjectiveService} from '../../objective/objective.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {ToastService} from '../../../../shared/services/toast.service';
import {FormComponent} from './form/form.component';
import Swal from 'sweetalert2';
import {TargetComponent} from '../../objective/target/target.component';
import {Plan} from '../plan';

@Component({
  selector: 'app-objective',
  templateUrl: './objective.component.html',
  styleUrls: ['./objective.component.scss']
})
export class ObjectiveComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'code', 'description', 'manage'];
  page = ApiConfig.page;
  size = ApiConfig.size;
  perPageOptions = ApiConfig.perPageOptions;
  totalItems = 0;
  private objectiveListSubject: BehaviorSubject<Objective[]> = new BehaviorSubject([]);
  plan: Plan;

  constructor(
    private objectiveService: ObjectiveService,
    private dialogRef: MatDialogRef<ObjectiveComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialog: MatDialog,
    private toast: ToastService
  ) {
    this.plan = data.plan;
  }

  ngOnInit(): void {
    this.loadData(this.page, this.size, this.plan.id);
  }

  loadData(page: number, size: number, planId: number): void {
    this.objectiveService.getAll(planId, page, size).subscribe((response) => {
      this.objectiveListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getItems(): Observable<Objective[]> {
    return this.objectiveListSubject.asObservable();
  }

  close(): void {
    this.dialogRef.close();
  }

  form(row?: Objective): void {
    const data = {
      objective: row ? row : undefined,
      plan: this.plan
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = data;
    const dl = this.dialog.open(FormComponent, dialogConfig);
    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        this.loadData(this.page, this.size, this.plan.id);
        this.toast.success('Success', 'Objective created successfully!');
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
        this.objectiveService.delete(row.id)
          .subscribe((response) => {
            this.loadData(this.page, this.size, this.plan.id);
            this.toast.success('Success!', 'Objective deleted successfully!');
          });
      }
    });
  }

  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    this.loadData(this.page, this.size, this.plan.id);
  }

  targets(row: Objective): void {
    const data = {
      objective: row
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    dialogConfig.data = data;
    const dl = this.dialog.open(TargetComponent, dialogConfig);
    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        this.loadData(this.page, this.size, this.plan.id);
      }
    });
  }
}
