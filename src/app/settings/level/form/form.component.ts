import {Component, OnInit} from '@angular/core';
import {UntypedFormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {DivisionLevel} from '../level';
import {DivisionLevelService} from '../level.service';
import {ToastService} from "../../../shared/services/toast.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  divisionLevel: DivisionLevel;
  id: number = 0;
  nameControl = new UntypedFormControl('', [Validators.required]);
  positionControl = new UntypedFormControl('', [Validators.required]);

  constructor(private router: Router,
              private service: DivisionLevelService,
              private toast: ToastService,
              private activatedRoute: ActivatedRoute) {
    if (this.activatedRoute.snapshot.params.id) {
      this.id = Number(atob(this.activatedRoute.snapshot.params.id));
    }
  }

  public ngOnInit(): void {
    if (this.id !== 0) {
      this.loadLevel(this.id);
    }
  }

  loadLevel(id: number): void {
    this.service.get(id).subscribe(response => {
      this.divisionLevel = response.data;
      this.nameControl.setValue(this.divisionLevel.name);
      this.positionControl.setValue(this.divisionLevel.position);
    });
  }

  public save(): void {
    if (this.id === 0) {
      const payload = {
        name: this.nameControl.value as string,
        position: this.positionControl.value as number
      } as DivisionLevel;
      this.service.store(payload).subscribe(response => {
        this.toast.success('Success!',response.message);
        this.close();
      });
    } else {
      const payload = {
        id: this.id,
        name: this.nameControl.value as string,
        position: this.positionControl.value as number
      } as DivisionLevel;
      this.service.update(payload).subscribe(response => {
        this.toast.success('Success!',response.message);
        this.close();
      });
    }
  }

  public close(): void {
    this.router.navigate(['settings/hierarchy-levels']);
  }
}
