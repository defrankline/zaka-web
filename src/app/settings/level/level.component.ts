import { Component, OnInit } from '@angular/core';
import {environment} from '../../../environments/environment.prod';
import {BehaviorSubject, Observable} from 'rxjs';
import {ToastService} from '../../utils/toast/toast.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {DivisionLevel} from './level';
import {DivisionLevelService} from './level.service';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss']
})
export class LevelComponent implements OnInit {
  page = environment.page;
  size = environment.size;
  totalItems = 0;
  maxSize = environment.maxSize;
  itemListSubject: BehaviorSubject<DivisionLevel[]> = new BehaviorSubject([]);

  constructor(private service: DivisionLevelService,
              private toast: ToastService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loadData(this.page, this.size);
  }

  loadData(page: number, size: number): void {
    this.service.getAll(page, size).subscribe((response) => {
      this.itemListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getItems(): Observable<DivisionLevel[]> {
    return this.itemListSubject.asObservable();
  }

  pageChanged(event: any): void {
    this.page = event.page - 1;
    this.size = event.itemsPerPage;
    this.loadData(this.page, this.size);
  }

  delete(role: DivisionLevel): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.service.delete(role.id)
          .subscribe((response) => {
            this.loadData(this.page, this.size);
            this.toast.show(response.message);
          });
      }
    });
  }

  create(): void {
    this.router.navigate(['settings/hierarchy-levels/create']);
  }

  edit(row: DivisionLevel): void {
    this.router.navigate(['settings/hierarchy-levels/edit', btoa(String(row.id))]);
  }
}
