import {Component, Inject, OnInit, ViewChild} from '@angular/core';

import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SmsService} from '../sms.service';
import {BulkSmsDto, Sms} from '../sms';

import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {MatTableDataSource} from '@angular/material/table';
import {RecipientService} from '../recipient/recipient.service';
import {Recipient} from '../recipient/recipient';
import Swal from 'sweetalert2';
import {Division, DivisionTree} from '../../../settings/division/division';
import {User} from '../../../user-management/user/user';
import {ReminderCategory} from '../../../settings/reminder-category/reminder-category';
import {UserService} from '../../../user-management/user/user.service';
import {ReminderCategoryService} from '../../../settings/reminder-category/reminder-category.service';
import {DivisionService} from '../../../settings/division/division.service';
import {ITreeOptions} from '@circlon/angular-tree-component';
import {ToastService} from "../../../shared/services/toast.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  action: string;
  title: string;
  formGroup: FormGroup;
  sms: Sms;
  company: Division;
  isLoading = false;
  members: User[] | null = [];
  destinations: User[] | null = [];
  messageControl = new FormControl('', [Validators.required, Validators.maxLength(160)]);
  memberControl = new FormControl(null, [Validators.required]);
  toggleControl = new FormControl(false);
  internalControlControl = new FormControl(false);
  publishControl = new FormControl(false);
  reminderCategoryControl = new FormControl(null, [Validators.required]);

  displayedColumns: string[] = ['id', 'member', 'mobile', 'status', 'location', 'remove'];
  dataSource: MatTableDataSource<User>;

  options: ITreeOptions = {
    useCheckbox: false,
  };
  activatedHierarchy: Division;
  nodes: DivisionTree[];

  boardMembers: User[];
  internalControlMembers: User[];
  reminderCategories: ReminderCategory[];

  constructor(
    private smsService: SmsService,
    private userService: UserService,
    private companyService: DivisionService,
    private reminderCategoryService: ReminderCategoryService,
    private recipientService: RecipientService,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    private divisionService: DivisionService,
    private dialogRef: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.action = data.action;
    this.title = data.title;
    if (this.action === 'update') {
      this.sms = data.sms;
      this.messageControl.setValue(this.sms.message);
      this.reminderCategoryControl.setValue(this.sms.category);
      this.publishControl.setValue(this.sms.published);
    }
  }

  ngOnInit(): void {
    this.searchMembers();
    this.loadReminderCategories();
    if (this.action === 'update') {
      this.loadRecipients(this.sms.id);
    }
    this.loadCurrentCompany();
    this.loadCurrentUserAdministrativeTree();
  }

  loadCurrentCompany(): void {
    this.companyService.getCurrentUserAdminDivision().subscribe(response => {
      this.company = response.data;
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  loadCurrentUserAdministrativeTree(): void {
    this.divisionService.getCurrentUserTree().subscribe(response => {
      this.nodes = response.data;
    });
  }

  select(event: any) {
    this.destinations = [];
    this.activatedHierarchy = event.node.data as Division;
    this.loadAllMembers(this.activatedHierarchy.id);
  }


  loadReminderCategories(): void {
    this.reminderCategoryService.getAll().subscribe(response => {
      this.reminderCategories = response.data;
    });
  }

  loadAllMembers(id: number): void {
    this.userService.getAll(id).subscribe(response => {
      this.members = response.data;
      this.members.map(member => {
        const x = {
          id: member.id,
          firstName: member.firstName,
          surname: member.surname,
          middleName: member.middleName,
          number: member.number,
          mobile: member.mobile,
          email: member.email,
          division: member.division
        } as User;
        this.destinations.push(x);
      });
      this.dataSource = new MatTableDataSource(this.destinations);
    });
  }

  searchMembers(): void {
    this.memberControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(value => this.userService.search(0, 20, value)
          .pipe(finalize(() => (this.isLoading = false))))
      )
      .subscribe(response => {
        this.members = response.data.content;
      });
  }

  displayMember(user: User): string {
    if (user) {
      return user.number + ' - ' + user.firstName + ' ' + user.surname;
    } else {
      return '';
    }
  }

  add(): void {
    const member = this.memberControl.value as User;
    let exists = false;
    this.destinations.map(row => {
      if (member.id === row.id) {
        exists = true;
      }
    });
    if (!exists) {
      const x = {
        id: member.id,
        firstName: member.firstName,
        surname: member.surname,
        middleName: member.middleName,
        number: member.number,
        mobile: member.mobile,
        email: member.email,
        division: member.division
      } as User;
      this.destinations.push(x);
      this.dataSource = new MatTableDataSource(this.destinations);
      this.memberControl.reset();
    } else {
      this.toast.success('Success!','Member already added!');
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  remove(i): void {
    this.destinations.splice(i, 1);
    this.dataSource = new MatTableDataSource(this.destinations);
  }

  store(): void {
    const publish = this.publishControl.value as boolean;
    if (publish === true) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this process!',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, save and send it!'
      }).then(result => {
        if (result.value) {
          this.save();
        }
      });
    } else {
      this.save();
    }
  }

  validMobileNumber(mobile: string): boolean {
    if (mobile) {
      return mobile.length === 12;
    } else {
      return false;
    }
  }

  private save(): void {
    if (this.action === 'create') {
      const payload = {
        category: this.reminderCategoryControl.value as ReminderCategory,
        destinations: this.destinations,
        msg: this.messageControl.value as string,
        published: this.publishControl.value as boolean
      } as BulkSmsDto;
      this.create(payload);
    } else {
      const payload = {
        id: this.sms.id,
        category: this.reminderCategoryControl.value as ReminderCategory,
        destinations: this.destinations,
        msg: this.messageControl.value as string,
        published: this.publishControl.value as boolean
      } as BulkSmsDto;
      this.update(payload);
    }
  }

  trackReminderCategoryId(index: number, item: ReminderCategory): number {
    return item.id;
  }

  private create(payload: BulkSmsDto): void {
    this.smsService.store(payload).subscribe(response => {
      this.dialogRef.close(response);
    }, error => this.toast.success('Success!',error.error.message));
  }

  private update(payload: BulkSmsDto): void {
    this.smsService.update(payload).subscribe(response => {
      this.dialogRef.close(response);
    }, error => this.toast.success('Success!',error.error.message));
  }

  private loadRecipients(id: number): void {
    this.recipientService.getAll(id).subscribe(response => {
      const recipients = response.data as Recipient[];
      recipients.map(row => {
        const x = {
          id: row.user.id,
          firstName: row.user.firstName,
          surname: row.user.surname,
          middleName: row.user.middleName,
          number: row.user.number,
          mobile: row.user.mobile,
          email: row.user.email,
          division: row.user.division
        } as User;
        this.destinations.push(x);
      });
      this.dataSource.data = this.destinations;
    });
  }

  clear(): void {
    this.dataSource.data = [];
  }
}
