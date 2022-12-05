import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ReminderCategory} from '../reminder-category';
import {ReminderCategoryService} from '../reminder-category.service';
import {LedgerAccount} from '../../account/ledger-account';
import {ToastService} from "../../../shared/services/toast.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  action: string;
  title: string;
  formGroup: UntypedFormGroup;
  reminderCategory: ReminderCategory;
  accounts: LedgerAccount[] = [];

  constructor(
    private reminderCategoryService: ReminderCategoryService,
    private toast: ToastService,
    private formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.action = data.action;
    this.title = data.title;
    if (this.action === 'update') {
      this.reminderCategory = data.reminderCategory;
    }
  }

  ngOnInit(): void {
    this.formGroup = this.initFormGroup();
  }

  initFormGroup(): UntypedFormGroup {
    if (this.action === 'create') {
      return this.formBuilder.group({
        name: ['', Validators.required],
        code: ['', Validators.required],
      });
    } else {
      return this.formBuilder.group({
        name: [this.reminderCategory.name, Validators.required],
        code: [this.reminderCategory.code, Validators.required],
      });
    }
  }

  store(reminderCategory: ReminderCategory): void {
    if (this.action === 'create') {
      this.create(reminderCategory);
    } else {
      reminderCategory.id = this.reminderCategory.id;
      this.edit(reminderCategory);
    }
  }

  private edit(reminderCategory: ReminderCategory): void {
    this.reminderCategoryService.update(reminderCategory)
      .subscribe(response => {
        this.dialogRef.close(response);
      }, error => {
        this.toast.success('Success!','Reminder Category could not be updated!');
      });
  }

  private create(reminderCategory: ReminderCategory): void {
    this.reminderCategoryService.store(reminderCategory)
      .subscribe(response => {
        this.dialogRef.close(response);
      }, error => {
        this.toast.success('Success!',error.error.message);
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
