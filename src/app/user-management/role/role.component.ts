import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {RoleService} from './role.service';
import {environment} from '../../../environments/environment.prod';
import {Role} from './role';
import {BehaviorSubject, Observable} from 'rxjs';
import Swal from 'sweetalert2';
import {ToastService} from '../../utils/toast/toast.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RoleComponent implements OnInit {
  page = environment.page;
  size = environment.size;
  totalItems = 0;
  maxSize = environment.maxSize;
  itemListSubject: BehaviorSubject<Role[]> = new BehaviorSubject([]);

  constructor(private roleService: RoleService,
              private toast: ToastService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loadData(this.page, this.size);
  }

  loadData(page: number, size: number): void {
    this.roleService.getAll(page, size).subscribe((response) => {
      this.itemListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getItems(): Observable<Role[]> {
    return this.itemListSubject.asObservable();
  }

  pageChanged(event: any): void {
    this.page = event.page - 1;
    this.size = event.itemsPerPage;
    this.loadData(this.page, this.size);
  }

  delete(role: Role): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.roleService.delete(role.id)
          .subscribe((response) => {
            this.loadData(this.page, this.size);
            this.toast.show(response.message);
          });
      }
    });
  }

  create(): void {
    this.router.navigate(['user-management/roles/create']);
  }

  edit(row: Role): void {
    this.router.navigate(['user-management/roles/edit', btoa(String(row.id))]);
  }

  tiles(row: Role): void {
    this.router.navigate(['user-management/roles/tiles', btoa(String(row.id))]);
  }
}
