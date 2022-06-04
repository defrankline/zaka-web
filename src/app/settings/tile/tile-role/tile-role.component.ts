import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RoleService} from '../../../user-management/role/role.service';
import {TileRoleService} from './tile-role.service';
import {environment} from '../../../../environments/environment.prod';
import {BehaviorSubject, Observable} from 'rxjs';
import {Role} from '../../../user-management/role/role';
import {TileRole} from './tile-role';
import Swal from 'sweetalert2';
import {TileService} from '../tile.service';
import {Tile} from '../tile';
import {FormControl, Validators} from '@angular/forms';
import {ToastService} from "../../../shared/services/toast.service";

@Component({
  selector: 'app-tile-role',
  templateUrl: './tile-role.component.html',
  styleUrls: ['./tile-role.component.scss']
})
export class TileRoleComponent implements OnInit {
  tileId: number;
  tile: Tile;
  page = environment.page;
  size = environment.size;
  totalItems = 0;
  maxSize = environment.maxSize;
  itemListSubject: BehaviorSubject<TileRole[]> = new BehaviorSubject([]);
  roles: Role[];
  roleControl = new FormControl(null, [Validators.required]);
  showForm = false;

  constructor(private router: Router,
              private tileRoleService: TileRoleService,
              private toast: ToastService,
              private tileService: TileService,
              private roleService: RoleService,
              private activatedRoute: ActivatedRoute) {
    this.tileId = Number(atob(this.activatedRoute.snapshot.params.id));
  }

  ngOnInit(): void {
    this.loadData(this.tileId, this.page, this.size);
    this.loadTile(this.tileId);
  }

  loadTile(id: number): void {
    this.tileService.get(id).subscribe(response => {
      this.tile = response.data;
    });
  }

  loadRoles(): void {
    this.roleService.getAll().subscribe(response => {
      this.roles = response.data;
    });
  }

  loadData(tileId: number, page: number, size: number): void {
    this.tileRoleService.getAllByTileId(tileId, page, size).subscribe((response) => {
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
    this.loadData(this.tileId, this.page, this.size);
  }

  add(): void {
    this.showForm = true;
    this.loadRoles();
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
            this.loadData(this.tileId, this.page, this.size);
            this.toast.success('Success!',response.message);
          });
      }
    });
  }

  save(): void {
    const payload = {
      role: this.roleControl.value,
      tile: this.tile
    } as TileRole;
    this.tileRoleService.store(payload).subscribe(response => {
      this.showForm = false;
      this.loadData(this.tileId, this.page, this.size);
      this.toast.success('Success!',response.message);
    });
  }

  close(): void {
    this.showForm = false;
    this.roleControl.reset();
  }

  back(): void {
    this.router.navigate(['settings/tiles']);
  }
}
