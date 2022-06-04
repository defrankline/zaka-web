import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {randomString} from '../../../shared/helpers';
import {ToastService} from '../../../shared/services/toast.service';
import {AuthService} from '../../../auth/auth.service';
import {Budget, Projection} from '../budget';
import {BudgetService} from '../budget.service';
import {MatTableDataSource} from '@angular/material/table';
import {fromEvent, Observable} from 'rxjs';
import {pluck} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {GfsCode} from '../../../income-and-expenditure/gfs-code/gfs-code';
import {GfsCodeService} from '../../../income-and-expenditure/gfs-code/gfs-code.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  title: string;
  action: string;
  headFormGroup: FormGroup;
  revenueProjectionFormGroup: FormGroup;
  expenditureEstimateFormGroup: FormGroup;
  extraOrdinaryRevenueFormGroup: FormGroup;
  nameControl = new FormControl('', [Validators.required]);
  revenueProjectionAmountControl = new FormControl(0, [Validators.min(0)]);
  revenueProjectionActualAmountControl = new FormControl(0, [Validators.min(0)]);
  extraOrdinaryRevenueProjectionAmountControl = new FormControl(0, [Validators.min(0)]);
  extraOrdinaryRevenueProjectionActualAmountControl = new FormControl(0, [Validators.min(0)]);
  expenditureEstimateAmountControl = new FormControl(0, [Validators.min(0)]);
  expenditureEstimateActualAmountControl = new FormControl(0, [Validators.min(0)]);
  revenueProjectionItemControl = new FormControl(null);
  extraOrdinaryRevenueProjectionItemControl = new FormControl(null);
  expenditureEstimateItemControl = new FormControl(null);
  revenueProjectionDescriptionControl = new FormControl('Revenue');
  extraOrdinaryRevenueProjectionDescriptionControl = new FormControl('Extra Ordinary Revenue');
  expenditureEstimateDescriptionControl = new FormControl('Expenses');
  currentUser: any;
  budget: Budget;
  incomeSources: GfsCode[] = [];
  expenditureCategories: GfsCode[] = [];
  extraOrdinaryRevenues: GfsCode[] = [];
  revenueProjections: Projection[] = [];
  expenditureEstimates: Projection[] = [];
  extraOrdinaryRevenueProjections: Projection[] = [];
  id: number;

  revenueProjectionColumns: string[] = ['id', 'source', 'description', 'amount', 'actual', 'remove'];
  revenueProjectionDataSource = new MatTableDataSource<Projection>();
  expenditureEstimateColumns: string[] = ['id', 'item', 'description', 'amount', 'actual', 'remove'];
  expenditureEstimateDataSource = new MatTableDataSource<Projection>();
  extraOrdinaryRevenueProjectionColumns: string[] = ['id', 'item', 'description', 'amount', 'actual', 'remove'];
  extraOrdinaryRevenueProjectionDataSource = new MatTableDataSource<Projection>();
  fileToUploadName: string;
  fileToUpload: string;
  boardApprovalDocument: any;
  boardBudgetDocumentControl = new FormControl(null, [Validators.required]);

  constructor(private toast: ToastService,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private gfsCodeService: GfsCodeService,
              private activatedRoute: ActivatedRoute,
              private budgetService: BudgetService) {
    const user = this.authService.user();
    this.currentUser = user.data.currentUserDto.user;
    if (this.activatedRoute.snapshot.params.id) {
      this.action = 'update';
      this.title = 'budget-update';
      this.id = this.activatedRoute.snapshot.params.id;
    } else {
      this.title = 'budget-preparation-form';
      this.action = 'create';
      this.nameControl.setValue('Annual Budget');
    }
  }

  private loadBudget(id: number): void {
    this.budgetService.getOne(id).subscribe(response => {
      this.budget = response.data;
      this.nameControl.setValue(this.budget.name);
    });
  }

  ngOnInit(): void {
    this.filterIncomeSources('_');
    this.filterExpenditureCategories('_');
    this.filterExtraOrdinaryRevenue('_');
    if (this.action === 'update') {
      this.loadItems(this.id);
      this.loadBudget(this.id);
    }
  }

  loadItems(id: number): void {
    this.budgetService.items(id).subscribe(response => {
      this.revenueProjections = response.data.revenueProjections;
      this.revenueProjectionDataSource.data = this.revenueProjections;
      this.expenditureEstimates = response.data.expenditureEstimates;
      this.expenditureEstimateDataSource.data = response.data.expenditureEstimates;
      this.extraOrdinaryRevenueProjections = response.data.extraOrdinaryRevenueProjections;
      this.extraOrdinaryRevenueProjectionDataSource.data = response.data.extraOrdinaryRevenueProjections;
    });
  }

  filterIncomeSources(query: string): void {
    if (query.length > 0) {
      this.gfsCodeService.getAllByGfsCodeType('REVENUE', query.toLowerCase()).subscribe((response) => {
        this.incomeSources = response.data;
      }, error => {
        this.toast.error('Error', error.error.message, 10000);
      });
    }
  }

  filterExpenditureCategories(query: string): void {
    if (query.length > 0) {
      this.gfsCodeService.getAllByGfsCodeType('EXPENSE', query.toLowerCase()).subscribe((response) => {
        this.expenditureCategories = response.data;
      }, error => {
        this.toast.error('Error', error.error.message, 10000);
      });
    }
  }

  filterExtraOrdinaryRevenue(query: string): void {
    if (query.length > 0) {
      this.gfsCodeService.getAllByTreatment('EXTRA_ORDINARY', query.toLowerCase()).subscribe((response) => {
        this.extraOrdinaryRevenues = response.data;
      }, error => {
        this.toast.error('Error', error.error.message, 10000);
      });
    }
  }

  displayExpenditureEstimateItem(item?: GfsCode): string | undefined {
    return item ? item.name : undefined;
  }

  displayRevenueProjectionItem(item?: GfsCode): string | undefined {
    return item ? item.name : undefined;
  }

  displayExtraOrdinaryRevenueProjectionItem(item?: GfsCode): string | undefined {
    return item ? item.name : undefined;
  }

  checkRevenueProjectionItem(): void {
    if (this.revenueProjectionItemControl.value) {
      const x = this.revenueProjectionItemControl.value as GfsCode;
      if (x === null) {
        this.revenueProjectionItemControl.reset();
      } else {
        if (!x.id) {
          this.revenueProjectionItemControl.reset();
        }
      }
    }
  }

  checkExtraOrdinaryRevenueProjectionItem(): void {
    if (this.extraOrdinaryRevenueProjectionItemControl.value) {
      const x = this.extraOrdinaryRevenueProjectionItemControl.value as GfsCode;
      if (x === null) {
        this.extraOrdinaryRevenueProjectionItemControl.reset();
      } else {
        if (!x.id) {
          this.extraOrdinaryRevenueProjectionItemControl.reset();
        }
      }
    }
  }

  checkExpenditureEstimateItem(): void {
    if (this.expenditureEstimateItemControl.value) {
      const x = this.expenditureEstimateItemControl.value as GfsCode;
      if (x === null) {
        this.expenditureEstimateItemControl.reset();
      } else {
        if (!x.id) {
          this.expenditureEstimateItemControl.reset();
        }
      }
    }
  }

  deleteRevenueProjectionItem(i: number): void {
    this.revenueProjections.splice(i, 1);
    this.revenueProjectionDataSource.data = this.revenueProjections;
    this.totalRevenueProjection();
  }

  deleteExtraOrdinaryRevenueProjectionItem(i: number): void {
    this.extraOrdinaryRevenueProjections.splice(i, 1);
    this.extraOrdinaryRevenueProjectionDataSource.data = this.extraOrdinaryRevenueProjections;
    this.totalExtraOrdinaryRevenueProjection();
  }

  totalRevenueProjection(): number {
    let total = 0;
    if (this.revenueProjections) {
      this.revenueProjections.forEach(row => {
        total = total + row.amount;
      });
    }
    return total;
  }

  totalActualRevenue(): number {
    let total = 0;
    if (this.revenueProjections) {
      this.revenueProjections.forEach(row => {
        total = total + row.actual;
      });
    }
    return total;
  }

  totalExtraOrdinaryRevenueProjection(): number {
    let total = 0;
    if (this.extraOrdinaryRevenueProjections) {
      this.extraOrdinaryRevenueProjections.forEach(row => {
        total = total + row.amount;
      });
    }
    return total;
  }

  totalActualExtraOrdinaryRevenue(): number {
    let total = 0;
    if (this.extraOrdinaryRevenueProjections) {
      this.extraOrdinaryRevenueProjections.forEach(row => {
        total = total + row.actual;
      });
    }
    return total;
  }

  deleteExpenditureEstimateItem(i: number): void {
    this.expenditureEstimates.splice(i, 1);
    this.expenditureEstimateDataSource.data = this.expenditureEstimates;
    this.totalExpenditureEstimate();
  }

  totalExpenditureEstimate(): number {
    let total = 0;
    if (this.expenditureEstimates) {
      this.expenditureEstimates.forEach(row => {
        total = total + row.amount;
      });
    }
    return total;
  }

  totalActualExpense(): number {
    let total = 0;
    if (this.expenditureEstimates) {
      this.expenditureEstimates.forEach(row => {
        total = total + row.actual;
      });
    }
    return total;
  }

  addExpenditureEstimateItem(): void {
    const itemValue = this.expenditureEstimateItemControl.value as GfsCode;
    let exists = false;
    this.expenditureEstimates.forEach(row => {
      if (row.input.id === itemValue.id) {
        exists = true;
      }
    });
    if (!exists) {
      const amountValue = this.expenditureEstimateAmountControl.value as number;
      const actualAmountValue = this.expenditureEstimateActualAmountControl.value as number;
      const descriptionValue = this.expenditureEstimateDescriptionControl.value as string;
      const item = {
        input: itemValue,
        amount: amountValue,
        description: descriptionValue,
        actual: actualAmountValue,
      } as Projection;
      this.expenditureEstimates.push(item);
      this.expenditureEstimateDataSource.data = this.expenditureEstimates;
      this.expenditureEstimateItemControl.reset('');
      this.expenditureEstimateAmountControl.reset('');
      this.expenditureEstimateDescriptionControl.reset('');
    } else {
      this.toast.warning('Duplicate', 'Item Already Added', 5000);
    }
  }

  addRevenueProjectionItem(): void {
    const itemValue = this.revenueProjectionItemControl.value as GfsCode;
    let exists = false;
    this.revenueProjections.forEach(row => {
      if (row.input.id === itemValue.id) {
        exists = true;
      }
    });
    if (!exists) {
      const amountValue = this.revenueProjectionAmountControl.value as number;
      const actualAmountValue = this.revenueProjectionActualAmountControl.value as number;
      const descriptionValue = this.revenueProjectionDescriptionControl.value as string;
      const item = {
        input: itemValue,
        amount: amountValue,
        actual: actualAmountValue,
        description: descriptionValue,
      } as Projection;
      this.revenueProjections.push(item);
      this.revenueProjectionDataSource.data = this.revenueProjections;
      this.revenueProjectionItemControl.reset('');
      this.revenueProjectionAmountControl.reset('');
      this.revenueProjectionDescriptionControl.reset('');
    } else {
      this.toast.warning('Duplicate', 'Item Already Added', 5000);
    }
  }

  addExtraOrdinaryRevenueProjectionItem(): void {
    const itemValue = this.extraOrdinaryRevenueProjectionItemControl.value as GfsCode;
    let exists = false;
    this.extraOrdinaryRevenueProjections.forEach(row => {
      if (row.input.id === itemValue.id) {
        exists = true;
      }
    });
    if (!exists) {
      const amountValue = this.extraOrdinaryRevenueProjectionAmountControl.value as number;
      const amountActualValue = this.extraOrdinaryRevenueProjectionActualAmountControl.value as number;
      const descriptionValue = this.extraOrdinaryRevenueProjectionDescriptionControl.value as string;
      const item = {
        input: itemValue,
        amount: amountValue,
        actual: amountActualValue,
        description: descriptionValue,
      } as Projection;
      this.extraOrdinaryRevenueProjections.push(item);
      this.extraOrdinaryRevenueProjectionDataSource.data = this.extraOrdinaryRevenueProjections;
      this.extraOrdinaryRevenueProjectionItemControl.reset('');
      this.extraOrdinaryRevenueProjectionAmountControl.reset('');
    } else {
      this.toast.warning('Duplicate', 'Item Already Added', 5000);
    }
  }

  editRevenueProjectionItem(index: number, row: Projection): void {
    this.revenueProjectionItemControl.setValue(row.input);
    this.revenueProjectionAmountControl.setValue(row.amount);
    this.revenueProjectionDescriptionControl.setValue(row.description);
    this.deleteRevenueProjectionItem(index);
  }

  editExtraOrdinaryRevenueProjectionItem(index: number, row: Projection): void {
    this.extraOrdinaryRevenueProjectionItemControl.setValue(row.input);
    this.extraOrdinaryRevenueProjectionAmountControl.setValue(row.amount);
    this.deleteRevenueProjectionItem(index);
  }

  editExpenditureEstimateItem(index: number, row: Projection): void {
    this.expenditureEstimateItemControl.setValue(row.input);
    this.expenditureEstimateAmountControl.setValue(row.amount);
    this.expenditureEstimateDescriptionControl.setValue(row.description);
    this.deleteRevenueProjectionItem(index);
  }

  close(): void {
    this.router.navigate(['app/planning-and-budgeting/budgets']);
  }

  store(): void {
    const fileReader = new FileReader();
    const document = this.boardBudgetDocumentControl.value;
    this.fileToBase64(fileReader, document).subscribe(base64image => {
      this.fileToUpload = base64image;
      const file = this.fileToUpload.toString().split(',')[1];
      if (this.action === 'create') {
        this.create(file);
      } else {
        this.edit(file);
      }
    });
  }

  private create(file: any): void {
    const nameValue = this.nameControl.value as string;
    const payload = {
      revenueProjections: this.revenueProjections,
      expenditureEstimates: this.expenditureEstimates,
      extraOrdinaryRevenueProjections: this.extraOrdinaryRevenueProjections,
      name: nameValue,
      approved: false,
      type: 'ANNUAL',
      parent: null,
      boardApprovalDocument: file
    } as Budget;
    this.budgetService.store(payload).subscribe((response) => {
      if (response.status === 201) {
        this.router.navigate(['app/planning-and-budgeting/budgets']);
        this.toast.success('Success!', 'Budget Initiated Successfully!', 5000);
      } else {
        this.toast.warning('Warning', response.message, 10000);
      }
    }, error => {

      this.toast.error('Error', error.error.message, 10000);
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

  private edit(file: any): void {
    const nameValue = this.nameControl.value as string;
    const numberValue = randomString(16).toUpperCase();
    const payload = {
      id: this.budget.id,
      revenueProjections: this.revenueProjections,
      expenditureEstimates: this.expenditureEstimates,
      extraOrdinaryRevenueProjections: this.extraOrdinaryRevenueProjections,
      name: nameValue,
      approved: false,
      parent: null,
      type: 'ANNUAL',
      boardApprovalDocument: file,
    } as Budget;
    this.budgetService.update(payload).subscribe((response) => {
      if (response.status === 201) {
        this.router.navigate(['app/planning-and-budgeting/budgets']);
        this.toast.success('Success!', 'Budget Updated Successfully!', 5000);
      } else {
        this.toast.warning('Warning', response.message, 10000);
      }
    }, error => {

      this.toast.error('Error', error.error.message, 10000);
    });
  }

  setRevenueProjectionDescription(): void {
    this.revenueProjectionDescriptionControl.setValue(this.revenueProjectionItemControl.value.name);
  }

  setExpenditureEstimateDescription(): void {
    this.expenditureEstimateDescriptionControl.setValue(this.expenditureEstimateItemControl.value.name);
  }
}
