import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TileService} from '../tile.service';
import {Tile} from '../tile';
import {RoleService} from '../../../user-management/role/role.service';
import {ToastService} from "../../../shared/services/toast.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  tile: Tile;
  id: number = 0;
  formGroup: FormGroup;
  parents: Tile[];

  constructor(private router: Router,
              private tileService: TileService,
              private toast: ToastService,
              private formBuilder: FormBuilder,
              private roleService: RoleService,
              private activatedRoute: ActivatedRoute) {
    if (this.activatedRoute.snapshot.params.id) {
      this.id = Number(atob(this.activatedRoute.snapshot.params.id));
    }
  }

  public ngOnInit(): void {
    if (this.id !== 0) {
      this.loadTile(this.id);
    }
    this.loadParents();
    this.formGroup = this.initFormGroup();
  }

  initFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      url: ['', Validators.required],
      icon: ['icon-pencil', [Validators.required]],
      parent: [null],
      sortOrder: [0, [Validators.required, Validators.min(0)]],
    });
  }

  loadParents(): void {
    this.tileService.getAllParents().subscribe(response => {
      this.parents = response.data;
    });
  }

  loadTile(id: number): void {
    this.tileService.get(id).subscribe(response => {
      this.tile = response.data;
      this.formGroup = this.formBuilder.group({
        name: [this.tile.name, Validators.required],
        url: [this.tile.url, Validators.required],
        icon: [this.tile.icon, [Validators.required]],
        parent: [this.tile.parent],
        sortOrder: [this.tile.sortOrder, [Validators.required, Validators.min(0)]],
      });
    });
  }

  public save(tile: Tile): void {
    let parent = null;
    if (tile.parent !== null) {
      parent = {
        id: tile.parent.id
      } as Tile;
    }
    tile.parent = parent;
    if (this.id === 0) {
      this.tileService.store(tile).subscribe(response => {
        this.toast.success('Success!',response.message);
        this.close();
      });
    } else {
      tile.id = this.id;
      this.tileService.update(tile).subscribe(response => {
        this.toast.success('Success!',response.message);
        this.close();
      });
    }
  }

  public close(): void {
    this.router.navigate(['app/settings/tiles']);
  }

  trackParentId(index: number, item: Tile): number {
    return item.id;
  }
}
