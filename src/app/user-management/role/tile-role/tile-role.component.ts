import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from '../../../utils/toast/toast.service';
import {RoleService} from '../role.service';
import {environment} from '../../../../environments/environment.prod';
import {BehaviorSubject, Observable} from 'rxjs';
import {Role} from '../role';
import Swal from 'sweetalert2';
import {FormControl, Validators} from '@angular/forms';
import {TileRole} from '../../../settings/tile/tile-role/tile-role';
import {Tile} from '../../../settings/tile/tile';
import {TileRoleService} from '../../../settings/tile/tile-role/tile-role.service';
import {TileService} from '../../../settings/tile/tile.service';

@Component({
  selector: 'app-tile-role',
  templateUrl: './tile-role.component.html',
  styleUrls: ['./tile-role.component.scss']
})
export class TileRoleComponent implements OnInit {
  roleId: number;
  role: Role;
  page = environment.page;
  size = environment.size;
  totalItems = 0;
  maxSize = environment.maxSize;
  itemListSubject: BehaviorSubject<TileRole[]> = new BehaviorSubject([]);
  tiles: Tile[];
  tileControl = new FormControl(null, [Validators.required]);
  showForm = false;

  constructor(private router: Router,
              private tileRoleService: TileRoleService,
              private toast: ToastService,
              private roleService: RoleService,
              private tileService: TileService,
              private activatedRoute: ActivatedRoute) {
    this.roleId = Number(atob(this.activatedRoute.snapshot.params.id));
  }

  ngOnInit(): void {
    this.loadData(this.roleId, this.page, this.size);
    this.loadRole(this.roleId);
  }

  loadRole(id: number): void {
    this.roleService.get(id).subscribe(response => {
      this.role = response.data;
    });
  }

  loadTiles(): void {
    this.tileService.getAll().subscribe(response => {
      this.tiles = response.data;
    });
  }

  loadData(roleId: number, page: number, size: number): void {
    this.tileRoleService.getAllByRoleId(roleId, page, size).subscribe((response) => {
      this.itemListSubject.next(response.data.content);
      this.totalItems = response.data.totalElements;
    });
  }

  getItems(): Observable<TileRole[]> {
    return this.itemListSubject.asObservable();
  }

  pageChanged(event: any): void {
    this.page = event.page - 1;
    this.size = event.itemsPerPage;
    this.loadData(this.roleId, this.page, this.size);
  }

  add(): void {
    this.showForm = true;
    this.loadTiles();
  }

  delete(tileRole: TileRole): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.tileRoleService.delete(tileRole.id)
          .subscribe((response) => {
            this.loadData(this.roleId, this.page, this.size);
            this.toast.show(response.message);
          });
      }
    });
  }

  save(): void {
    const payload = {
      tile: this.tileControl.value,
      role: this.role
    } as TileRole;
    this.tileRoleService.store(payload).subscribe(response => {
      this.showForm = false;
      this.loadData(this.roleId, this.page, this.size);
      this.toast.show(response.message);
    });
  }

  close(): void {
    this.showForm = false;
    this.tileControl.reset();
  }

  back(): void {
    this.router.navigate(['user-management/roles']);
  }
}
