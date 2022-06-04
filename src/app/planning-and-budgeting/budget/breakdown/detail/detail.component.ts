import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';
import {ToastService} from '../../../../shared/services/toast.service';
import {BudgetProjectionVsActual} from '../budget-projection-vs-actual';
import {ExpenditureItemService} from '../../../../income-and-expenditure/expenditure/expenditure-item.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {ExpenditureItem} from '../../../../income-and-expenditure/expenditure/expenditure';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ApiConfig} from '../../../../shared';
import {ReceiptComponent} from '../receipt/receipt.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  item: BudgetProjectionVsActual;
  displayedColumns: string[] = ['id', 'date', 'narration', 'amount', 'receipt'];
  year: string;
  expenditureItemListSubject: BehaviorSubject<ExpenditureItem[]> = new BehaviorSubject([]);
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  page: number;
  size: number;
  perPageOptions = [];
  totalItems: number;

  constructor(private dialogRef: MatDialogRef<DetailComponent>,
              private toast: ToastService,
              private dialog: MatDialog,
              private expenditureItemService: ExpenditureItemService,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.item = data.item;
    this.year = data.year;
    this.page = ApiConfig.page;
    this.size = ApiConfig.size;
    this.perPageOptions = ApiConfig.perPageOptions;
  }

  ngOnInit(): void {
    this.loadData(this.item.id, this.page, this.size);
  }

  loadData(expenditureCategoryId: number, page: number, size: number): void {
    this.expenditureItemService.detail(expenditureCategoryId, page, size, this.year).subscribe((response) => {
      this.expenditureItemListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getItems(): Observable<ExpenditureItem[]> {
    return this.expenditureItemListSubject.asObservable();
  }

  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    this.loadData(this.item.id, this.page, this.size);
  }

  close(): void {
    this.dialogRef.close();
  }

  receipt(row: ExpenditureItem): void {
    const data = {
      id: row.id,
      type: 'ITEM'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = data;
    this.dialog.open(ReceiptComponent, dialogConfig);
  }

  total(): number {
    const items = this.expenditureItemListSubject.getValue();
    return items.map(t => t.amount).reduce((acc, value) => acc + value, 0);
  }
}
