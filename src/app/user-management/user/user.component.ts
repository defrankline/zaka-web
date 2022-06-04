import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment.prod';
import {BehaviorSubject, Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {User} from './user';
import {UserService} from './user.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {FormComponent} from './form/form.component';
import {ITreeOptions} from '@circlon/angular-tree-component';
import {Division, DivisionTree} from '../../settings/division/division';
import {DivisionService} from '../../settings/division/division.service';
import {UploadComponent} from './upload/upload.component';
import {UserRoleListComponent} from './user-role-list';
import {ToastService} from "../../shared/services/toast.service";
import {CustomResponse} from "../../shared/custom-response";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  displayedColumns: string[] = ['id', 'firstName', 'middleName', 'surname', 'number', 'mobile', 'division', 'username', 'manage'];
  page = environment.page;
  size = environment.size;
  totalItems = 0;
  maxSize = environment.maxSize;
  perPageOptions = environment.perPageOptions;
  queryString = '_';
  itemListSubject: BehaviorSubject<User[]> = new BehaviorSubject([]);
  isLoading = false;
  searchControl = new FormControl('');

  options: ITreeOptions = {
    useCheckbox: false,
  };
  activatedHierarchy: Division;
  nodes: DivisionTree[];

  constructor(private userService: UserService,
              private toast: ToastService,
              private divisionService: DivisionService,
              private dialog: MatDialog,
              private router: Router) {
  }

  ngOnInit(): void {
    this.search();
    this.loadCurrentUserAdministrativeTree();
  }

  loadCurrentUserAdministrativeTree(): void {
    this.divisionService.getCurrentUserTree().subscribe(response => {
      this.nodes = response.data;
      this.activatedHierarchy = this.nodes[0] as Division;
      this.loadData(this.activatedHierarchy.id, this.queryString, this.page, this.size);
    });
  }

  select(event: any) {
    this.activatedHierarchy = event.node.data as Division;
    this.loadData(this.activatedHierarchy.id, this.queryString, this.page, this.size);
  }

  loadData(divisionId: number, query: string, page: number, size: number): void {
    this.userService.getAll(divisionId, query, page, size).subscribe((response) => {
      this.itemListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getItems(): Observable<User[]> {
    return this.itemListSubject.asObservable();
  }

  pageChanged(event: any): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.queryString = this.searchControl.value;
    this.loadData(this.activatedHierarchy.id, this.queryString, this.page, this.size);
  }

  delete(user: User): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.userService.delete(user.id)
          .subscribe((response) => {
            this.loadData(this.activatedHierarchy.id, this.queryString, this.page, this.size);
            this.toast.show(response.message);
          });
      }
    });
  }

  createOrUpdate(row?: User): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = {
      user: row ? row : undefined,
      division: this.activatedHierarchy
    };
    const dl = this.dialog.open(FormComponent, dialogConfig);
    dl.afterClosed().subscribe((response: CustomResponse) => {
      if (response) {
        this.loadData(this.activatedHierarchy.id, this.queryString, this.page, this.size);
        this.toast.show(response);
      }
    });
  }

  roles(row: User): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = {user: row};
    this.dialog.open(UserRoleListComponent, dialogConfig);
  }

  search(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(value => this.userService.getAll(this.activatedHierarchy.id, value.toString(), this.page, this.size)
          .pipe(finalize(() => (this.isLoading = false))))
      )
      .subscribe(response => {
        this.itemListSubject.next(response.data.content);
        this.totalItems = response.data.totalElements;
      });
  }

  upload(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = {
      division: this.activatedHierarchy
    };
    const dl = this.dialog.open(UploadComponent, dialogConfig);
    dl.afterClosed().subscribe((response: CustomResponse) => {
      if (response) {
        this.loadData(this.activatedHierarchy.id, this.queryString, this.page, this.size);
        this.toast.show(response);
      }
    });
  }
}
