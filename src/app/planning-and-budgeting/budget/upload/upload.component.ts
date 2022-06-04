import {Component, OnInit} from '@angular/core';
import {BudgetService} from '../budget.service';
import {FinancialYearService} from '../../../setup-and-configuration/cooperative/financial-year/financial-year.service';
import {FormControl, Validators} from '@angular/forms';
import {BudgetUpload, BudgetUploadItem} from './budget-upload-item';
import * as excel from 'xlsx';
import Swal from 'sweetalert2';
import {ToastService} from '../../../shared/services/toast.service';
import {Budget} from '../budget';
import {FinancialYear} from '../../../setup-and-configuration/cooperative/financial-year/financial-year';
import {fromEvent, Observable} from 'rxjs';
import {pluck} from 'rxjs/operators';
import {Router} from '@angular/router';
import {saveAs} from 'file-saver';
import {TemplateService} from '../../../setup-and-configuration/template/template.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  yearControl = new FormControl(null, [Validators.required]);
  boardBudgetDocumentControl = new FormControl(null, [Validators.required]);
  items: BudgetUploadItem[] = [];
  revenueProjectionItems: BudgetUploadItem[] = [];
  expenditureEstimateItems: BudgetUploadItem[] = [];
  extraOrdinaryItems: BudgetUploadItem[] = [];
  typeControl = new FormControl('', [Validators.required]);
  parentControl = new FormControl(null);
  fileUploaded: File;
  storeData: any;
  jsonData: any;
  worksheet: any;
  fileToUploadName: string;
  fileToUpload: string;
  boardApprovalDocument: any;
  financialYears: FinancialYear[];
  parentBudgets: Budget[];

  constructor(private budgetService: BudgetService,
              private toast: ToastService,
              private templateService: TemplateService,
              private router: Router,
              private financialYearService: FinancialYearService) {
  }

  ngOnInit(): void {
    this.loadFinancialYears();
    this.loadParentBudgets();
  }

  loadFinancialYears(): void {
    this.financialYearService.getAll().subscribe(response => {
      this.financialYears = response.data;
    });
  }

  loadParentBudgets(): void {
    this.budgetService.getAll(0).subscribe(response => {
      this.parentBudgets = response.data;
    });
  }

  uploadedFile(event): void {
    this.fileUploaded = event.target.files[0];
    this.readExcel();
  }

  close(): void {
    this.router.navigate(['app/planning-and-budgeting/budgets']);
  }

  readExcel(): void {
    const readFile = new FileReader();
    readFile.onload = (e) => {
      this.storeData = readFile.result;
      const data = new Uint8Array(this.storeData);
      const arr = [];
      for (let i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const dataString = arr.join('');
      const workbook = excel.read(dataString, {type: 'binary'});
      const firstSheetName = workbook.SheetNames[0];
      this.worksheet = workbook.Sheets[firstSheetName];
    };
    readFile.readAsArrayBuffer(this.fileUploaded);
  }

  preview(): void {
    const items = [];
    const revenueArray = [];
    const expenditureArray = [];
    const extraOrdinaryArray = [];
    this.jsonData = excel.utils.sheet_to_json(this.worksheet, {raw: false});
    this.jsonData.forEach(row => {
      if (row.item !== null && row.code !== null && row.type !== null) {
        const item = {
          item: row.item,
          code: row.code,
          type: row.type,
          budget: Number(row.budget),
          actual: Number(row.actual),
        } as BudgetUploadItem;
        if (row.type === 'REVENUE') {
          revenueArray.push(item);
        } else if (row.type === 'EXPENDITURE') {
          expenditureArray.push(item);
        } else {
          extraOrdinaryArray.push(item);
        }
        items.push(item);
      }
    });
    this.items = items;
    this.revenueProjectionItems = revenueArray;
    this.expenditureEstimateItems = expenditureArray;
    this.extraOrdinaryItems = extraOrdinaryArray;
  }

  upload(): void {
    const errors = [];
    this.items.forEach(row => {
      if (!row.item || !row.code || !row.type) {
        errors.push(row);
      }
    });
    if (errors.length > 0) {
      this.toast.error('File Error', 'File has some blank fields, code,type,(budget or actual) cannot be blank');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Do it!'
    }).then(result => {
      if (result.value) {
        const fileReader = new FileReader();
        const document = this.boardBudgetDocumentControl.value;
        this.fileToBase64(fileReader, document).subscribe(base64image => {
          this.fileToUpload = base64image;
          const file = this.fileToUpload.toString().split(',')[1];
          const payload = {
            items: this.items,
            type: this.parentControl.value ? 'SUPPLEMENTARY' : 'ANNUAL',
            parent: this.parentControl.value as Budget,
            financialYear: this.yearControl.value as FinancialYear,
            boardApprovalDocument: file
          } as BudgetUpload;
          this.store(payload);
        });
      }
    });
  }

  onFileChange(event): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileToUploadName = file.name;
      this.boardBudgetDocumentControl.setValue(file);
    }
  }

  fileToBase64(fileReader: FileReader, fileToRead: File): Observable<any> {
    fileReader.readAsDataURL(fileToRead);
    return fromEvent(fileReader, 'load').pipe(pluck('currentTarget', 'result'));
  }

  private store(budgetUploadDto: BudgetUpload): void {
    this.budgetService.upload(budgetUploadDto).subscribe((response) => {
      if (response.status === 201 || response.status === 200) {
        this.router.navigate(['app/planning-and-budgeting/budgets']);
        this.toast.success('Success!', 'Budget Uploaded Successfully!', 5000);
      } else {
        this.toast.warning('Warning', response.message, 10000);
      }
    }, error => {
      this.toast.error('Error', error.error.message, 10000);
    });
  }

  downloadUploadTemplate(): void {
    this.templateService.budgetUpload().subscribe(response => {
      saveAs(new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      ), 'budget-upload-template.xlsx');
    });
  }

  totalRevenueProjection(): number {
    if (this.revenueProjectionItems) {
      return this.revenueProjectionItems.map(t => t.budget).reduce((acc, value) => acc + value, 0);
    } else {
      return 0;
    }
  }

  totalExpenditureEstimates(): number {
    if (this.expenditureEstimateItems) {
      return this.expenditureEstimateItems.map(t => t.budget).reduce((acc, value) => acc + value, 0);
    } else {
      return 0;
    }
  }

  totalExtraOrdinaryProjection(): number {
    if (this.extraOrdinaryItems) {
      return this.extraOrdinaryItems.map(t => t.budget).reduce((acc, value) => acc + value, 0);
    } else {
      return 0;
    }
  }

  totalActualExpenditure(): number {
    if (this.expenditureEstimateItems) {
      return this.expenditureEstimateItems.map(t => t.actual).reduce((acc, value) => acc + value, 0);
    } else {
      return 0;
    }
  }

  totalActualExtra(): number {
    if (this.extraOrdinaryItems) {
      return this.extraOrdinaryItems.map(t => t.actual).reduce((acc, value) => acc + value, 0);
    } else {
      return 0;
    }
  }

  totalActualRevenue(): number {
    if (this.revenueProjectionItems) {
      return this.revenueProjectionItems.map(t => t.actual).reduce((acc, value) => acc + value, 0);
    } else {
      return 0;
    }
  }
}
