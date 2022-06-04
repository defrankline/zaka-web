import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {ToastService} from '../../../../shared/services/toast.service';
import {FormBuilder} from '@angular/forms';
import {TargetService} from '../../target/target.service';
import {Target} from '../../target/target';
import {Objective} from '../objective';
import {ApiConfig} from '../../../../shared';
import {BehaviorSubject, Observable} from 'rxjs';
import Swal from 'sweetalert2';
import {FormComponent} from './form/form.component';
import {StrategyComponent} from './strategy/strategy.component';

@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.scss']
})
export class TargetComponent implements OnInit {
  objective: Objective;
  public displayedColumns: string[] = ['id', 'code', 'description', 'manage'];
  page = ApiConfig.page;
  size = ApiConfig.size;
  perPageOptions = ApiConfig.perPageOptions;
  totalItems = 0;
  private targetListSubject: BehaviorSubject<Target[]> = new BehaviorSubject([]);

  constructor(private targetService: TargetService,
              private dialogRef: MatDialogRef<TargetComponent>,
              private toast: ToastService,
              private dialog: MatDialog,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.objective = data.objective;
  }

  ngOnInit(): void {
    this.loadData(this.objective.id, this.page, this.size);
  }

  close(): void {
    this.dialogRef.close();
  }

  loadData(objectiveId: number, page: number, size: number): void {
    this.targetService.getAll(page, size, objectiveId).subscribe((response) => {
      this.targetListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getItems(): Observable<Target[]> {
    return this.targetListSubject.asObservable();
  }

  form(row?: Target): void {
    const data = {
      target: row ? row : undefined,
      objective: this.objective
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = data;
    const dl = this.dialog.open(FormComponent, dialogConfig);
    dl.afterClosed().subscribe((response: any) => {
      if (response) {
        this.loadData(this.objective.id, this.page, this.size);
        this.toast.success('Success', 'Target created successfully!');
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
        this.targetService.delete(row.id)
          .subscribe((response) => {
            this.loadData(this.objective.id, this.page, this.size);
            this.toast.success('Success!', 'Target deleted successfully!');
          });
      }
    });
  }

  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    this.loadData(this.objective.id, this.page, this.size);
  }

  strategies(row: Target): void {
    const data = {
      target: row
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    dialogConfig.data = data;
    this.dialog.open(StrategyComponent, dialogConfig);
  }
}
