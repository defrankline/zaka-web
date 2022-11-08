import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GenderEntity, User} from '../user';
import {UserService} from '../user.service';
import {Division} from '../../../settings/division/division';
import {Role} from '../../role/role';
import {RoleService} from '../../role/role.service';
import {DivisionService} from '../../../settings/division/division.service';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {ToastService} from "../../../shared/services/toast.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  user: User = undefined;
  formGroup: FormGroup;
  roles: Role[];
  isLoading = false;
  divisions: Division[] | null = [];
  level2Control = new FormControl(null)
  genderList: GenderEntity[];

  constructor(private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<FormComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private userService: UserService,
              private datePipe: DatePipe,
              private divisionService: DivisionService,
              private roleService: RoleService,
              private toast: ToastService) {
    if (this.data.user !== undefined) {
      this.user = this.data.user as User;
      const level1 = this.user.division as Division;
      this.level2Control.setValue(level1.parent?.number + '- ' + level1.parent?.name);
    }
  }

  ngOnInit(): void {
    this.formGroup = this.initFormGroup();
    this.loadRoles();
    this.searchDivisions();
    this.loadGenderList();
  }

  loadRoles(): void {
    this.roleService.getAll().subscribe(response => {
      this.roles = response.data;
      if (this.user === undefined) {
        const userRole = this.roles.find(row => row.name === 'ROLE_USER') as Role;
        this.formGroup.get("roles").setValue(userRole)
      }
    });
  }

  initFormGroup(): FormGroup {
    if (this.user === undefined) {
      return this.formBuilder.group({
        firstName: ['', Validators.required],
        middleName: ['', Validators.required],
        surname: ['', [Validators.required]],
        division: [null, [Validators.required]],
        roles: [null, [Validators.required]],
        username: ['', [Validators.required]],
        cardNumber: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        dob: [this.datePipe.transform(Date.now(), 'yyyy-MM-dd')],
        mobile: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12)]],
      });
    } else {
      return this.formBuilder.group({
        firstName: [this.user.firstName, Validators.required],
        middleName: [this.user.middleName, Validators.required],
        surname: [this.user.surname, [Validators.required]],
        roles: [this.user.roles, [Validators.required]],
        username: [this.user.username, [Validators.required]],
        division: [this.user.division, [Validators.required]],
        cardNumber: [this.user.cardNumber, [Validators.required]],
        dob: [this.datePipe.transform(this.user.dob, 'yyyy-MM-dd')],
        gender: [this.user.gender, [Validators.required]],
        mobile: [this.user.mobile, [Validators.required, Validators.minLength(12), Validators.maxLength(12)]],
      });
    }
  }

  store(): void {
    const dob = this.datePipe.transform(this.formGroup.get('dob').value, 'yyyy-MM-dd');
    const divisionValue = this.formGroup.get('division').value as Division;
    const location = {
      id: divisionValue.id,
      name: divisionValue.name,
      number: divisionValue.number
    } as Division;
    if (this.user === undefined) {
      const payload = {
        firstName: this.formGroup.get('firstName').value,
        division: location,
        middleName: this.formGroup.get('middleName').value,
        surname: this.formGroup.get('surname').value,
        roles: this.formGroup.get('roles').value,
        username: this.formGroup.get('username').value,
        mobile: this.formGroup.get('mobile').value,
        cardNumber: this.formGroup.get('cardNumber').value,
        number: this.formGroup.get('cardNumber').value,
        gender: this.formGroup.get('gender').value,
        dob: dob
      } as User;
      this.create(payload);
    } else {
      const payload = {
        id: this.user.id,
        number: this.user.number,
        firstName: this.formGroup.get('firstName').value,
        middleName: this.formGroup.get('middleName').value,
        surname: this.formGroup.get('surname').value,
        roles: this.formGroup.get('roles').value,
        mobile: this.formGroup.get('mobile').value,
        username: this.formGroup.get('username').value,
        cardNumber: this.formGroup.get('cardNumber').value,
        gender: this.formGroup.get('gender').value,
        division: location,
        dob: dob
      } as User;
      this.edit(payload);
    }
  }

  private edit(user: User): void {
    this.userService.update(user).subscribe(response => {
      this.dialogRef.close(response);
    }, error => {
      this.toast.success('Success!', error.error.message);
    });
  }

  private create(user: User): void {
    this.userService.store(user)
      .subscribe(response => {
        this.dialogRef.close(response);
      }, error => {
        this.toast.success('Success!', error.error.message);
      });
  }

  close(): void {
    this.dialogRef.close();
  }

  bindRole(c1: Role, c2: Role): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  searchDivisions(): void {
    this.formGroup.get('division').valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(value => this.divisionService.getAll(value, 0, 10).pipe(finalize(() => (this.isLoading = false))))
      )
      .subscribe(response => {
        this.divisions = response.data.content;
      });
  }

  loadGenderList(): void {
    this.genderList = this.userService.genderList();
  }

  displayDivision(user: Division): string {
    if (user) {
      return user.number + ' - ' + user.name;
    } else {
      return '';
    }
  }

  setLevel2() {
    const level1 = this.formGroup.get('division').value as Division;
    this.level2Control.setValue(level1.parent?.number + '- ' + level1.parent?.name);
  }

  trackGenderId(index: number, item: GenderEntity): string {
    return item.id;
  }
}
