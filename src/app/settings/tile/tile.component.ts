import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment.prod';
import {BehaviorSubject, Observable} from 'rxjs';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {Tile} from './tile';
import {TileService} from './tile.service';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {ToastService} from "../../shared/services/toast.service";

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {
  page = environment.page;
  size = environment.size;
  totalItems = 0;
  maxSize = environment.maxSize;
  queryString = '_';
  itemListSubject: BehaviorSubject<Tile[]> = new BehaviorSubject([]);
  isLoading = false;
  searchControl = new FormControl('');

  constructor(private tileService: TileService,
              private toast: ToastService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loadData(this.page, this.size);
    this.search();
  }

  loadData(page: number, size: number): void {
    this.tileService.getAll(page, size).subscribe((response) => {
      this.itemListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getItems(): Observable<Tile[]> {
    return this.itemListSubject.asObservable();
  }

  pageChanged(event: any): void {
    this.page = event.page - 1;
    this.size = event.itemsPerPage;
    this.loadData(this.page, this.size);
  }

  delete(tile: Tile): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.tileService.delete(tile.id)
          .subscribe((response) => {
            this.loadData(this.page, this.size);
            this.toast.success('Success!',response.message);
          });
      }
    });
  }

  create(): void {
    this.router.navigate(['settings/tiles/create']);
  }

  edit(row: Tile): void {
    this.router.navigate(['settings/tiles/edit', btoa(String(row.id))]);
  }

  roles(row: Tile): void {
    this.router.navigate(['settings/tiles/roles', btoa(String(row.id))]);
  }

  search(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(value => this.tileService.getAll(this.page, this.size, value.toString())
          .pipe(finalize(() => (this.isLoading = false))))
      )
      .subscribe(response => {
        this.itemListSubject.next(response.data.content);
        this.totalItems = response.data.totalElements;
      });
  }
}
