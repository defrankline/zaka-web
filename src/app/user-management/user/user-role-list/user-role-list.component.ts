import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';

import Swal from 'sweetalert2';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Role} from '../../role/role';
import {RoleService} from '../../role/role.service';
import {finalize} from 'rxjs/operators';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {User} from '../user';
import {UserRole} from '../user-role';
import {UserRoleService} from '../user-role.service';
import {environment} from '../../../../environments/environment.prod';
import {ToastService} from "../../../shared/services/toast.service";

@Component({
  selector: 'app-user-role-list',
  templateUrl: './user-role-list.component.html',
  styleUrls: ['./user-role-list.component.scss']
})
export class UserRoleListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'role', 'revoke'];
  page: number;
  size: number;
  perPageOptions = [];
  totalItems: number;
  user: any;
  roles: Role[];
  loading: boolean;
  userRoleListSubject: BehaviorSubject<UserRole[]> = new BehaviorSubject(null);
  getAllPagedSubscription: Subscription;
  getAllRoleSubscription: Subscription;
  deleteSubscription: Subscription;
  formGroup: UntypedFormGroup;
  queryString: string;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private userRoleService: UserRoleService,
    private roleService: RoleService,
    private dialog: MatDialog,
    private toast: ToastService,
    private formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<UserRoleListComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.page = environment.page;
    this.size = environment.size;
    this.perPageOptions = environment.perPageOptions;
    this.user = data.user;
    this.queryString = '_';
  }

  ngOnInit(): void {
    this.loadData(this.page, this.size, this.user.id);
    this.loadRoles(this.queryString, [1]);
    this.formGroup = this.initFormGroup();
  }

  initFormGroup(): UntypedFormGroup {
    return this.formBuilder.group({
      role: [null, Validators.required],
    });
  }

  loadRoles(queryString: string, exceptIds: number[]): void {
    this.loading = true;
    this.getAllRoleSubscription = this.roleService.getAllExcept(queryString, exceptIds)
      .subscribe((response) => {
        this.loading = false;
        this.roles = response.data;
      }, error => {
        this.loading = false;
      });
  }

  loadData(page: number, size: number, userId: number): void {
    this.loading = true;
    this.getAllPagedSubscription = this.userRoleService.getAllPaged(page, size, userId)
      .subscribe((response) => {
        this.loading = false;
        this.userRoleListSubject.next(response.data.content);
        this.totalItems = response.data.totalElements;
      }, error => {
        this.loading = false;
      });
  }

  getUserRoles(): Observable<UserRole[]> {
    return this.userRoleListSubject.asObservable();
  }

  grant(userRole: UserRole): void {
    this.loading = true;
    userRole.user = {
      id: this.user.id,
    } as User;
    this.userRoleService.store(userRole)
      .pipe(finalize(() => this.loading = false))
      .subscribe(response => {
        const items = this.userRoleListSubject.getValue();
        items.push(response.data);
        this.toast.success('Success!','Role Granted Successfully!');
      }, error => {
        this.toast.success('Success!',error.error.message);
      });
  }

  revoke(index, row): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.deleteSubscription = this.userRoleService.delete(row.id)
          .subscribe((response) => {
            const items = this.userRoleListSubject.getValue();
            items.splice(index, 1);
            this.toast.success('Success!','UserRole deleted successfully!');
          });
      }
    });
  }

  pageChanged(page): void {
    this.page = page.pageIndex;
    this.size = page.pageSize;
    this.loadData(this.page, this.size, this.user.id);
  }

  ngOnDestroy(): void {
    this.getAllRoleSubscription.unsubscribe();
    this.getAllPagedSubscription.unsubscribe();
  }
}
