import {Component, OnInit} from '@angular/core';
import {Role} from '../role';
import {FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {RoleService} from '../role.service';
import {ToastService} from '../../../utils/toast/toast.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  role: Role;
  id: number = 0;
  nameControl = new FormControl('', [Validators.required]);
  levelControl = new FormControl(null, [Validators.required]);

  constructor(private router: Router,
              private roleService: RoleService,
              private toast: ToastService,
              private activatedRoute: ActivatedRoute) {
    if (this.activatedRoute.snapshot.params.id) {
      this.id = Number(atob(this.activatedRoute.snapshot.params.id));
    }
  }

  public ngOnInit(): void {
    if (this.id !== 0) {
      this.loadRole(this.id);
    }
  }

  loadRole(id: number): void {
    this.roleService.get(id).subscribe(response => {
      this.role = response.data;
      this.nameControl.setValue(this.role.name);
    });
  }

  public save(): void {
    if (this.id === 0) {
      const payload = {
        name: this.nameControl.value
      } as Role;
      this.roleService.store(payload).subscribe(response => {
        this.toast.show(response.message);
        this.close();
      });
    } else {
      const payload = {
        id: this.id,
        name: this.nameControl.value
      } as Role;
      this.roleService.update(payload).subscribe(response => {
        this.toast.show(response.message);
        this.close();
      });
    }
  }

  public close(): void {
    this.router.navigate(['user-management/roles']);
  }
}
