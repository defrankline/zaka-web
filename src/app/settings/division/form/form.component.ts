import {Component, Inject, OnInit} from '@angular/core';
import {Division} from '../division';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DivisionLevelService} from '../../level/level.service';
import {DivisionLevel} from '../../level/level';
import {DivisionService} from '../division.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastService} from "../../../shared/services/toast.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  division: Division = undefined;
  formGroup = this.formBuilder.group({
    name: ['', Validators.required],
    level: [null, Validators.required],
    parent: [null],
    smsCount: [0, [Validators.min(0)]],
    email: ['', [Validators.email]],
    mobile: ['', [Validators.minLength(12), Validators.maxLength(12)]],
    telephone: ['', [Validators.minLength(12), Validators.maxLength(12)]],
    fax: [''],
    postalAddress: [''],
    location: [''],
    letterHead: [''],
    paymentInstruction: [''],
  });

  hierarchyLevels: DivisionLevel[];
  parents: Division[];


  constructor(private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<FormComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private hierarchyService: DivisionService,
              private toast: ToastService,
              private hierarchyLevelService: DivisionLevelService) {
    if (data.division !== undefined) {
      this.division = data.division;
      this.formGroup.get('level').setValue(this.division.level);
      this.formGroup.get('parent').setValue(this.division.parent);
      this.loadParents(this.division.level);
    }
  }

  ngOnInit(): void {
    this.loadHierarchyLevels();
    this.loadData();
  }

  loadData(): void {
    if (this.division !== undefined) {
      this.hierarchyService.get(this.division.id).subscribe(response => {
        this.division = response.data;
        this.formGroup = this.formBuilder.group({
          name: [this.division.name, Validators.required],
          level: [this.division.level, Validators.required],
          parent: [this.division.parent],
          smsCount: [this.division.smsCount, [Validators.min(0)]],
          email: [this.division.email, [Validators.email]],
          mobile: [this.division.mobile, [Validators.minLength(12), Validators.maxLength(12)]],
          telephone: [this.division.telephone, [Validators.minLength(12), Validators.maxLength(12)]],
          fax: [this.division.fax],
          postalAddress: [this.division.postalAddress],
          location: [this.division.location],
          letterHead: [this.division.letterHead],
          paymentInstruction: [this.division.paymentInstruction],
        });
      });
    }
  }

  loadHierarchyLevels(): void {
    this.hierarchyLevelService.getAll().subscribe(response => {
      this.hierarchyLevels = response.data;
    });
  }

  store(division: Division): void {
    const parent = this.formGroup.get('parent').value as Division;
    if (parent !== null) {
      division.parent = {
        id: parent.id
      } as Division;
    }
    if (this.division === undefined) {
      this.create(division);
    } else {
      division.id = this.division.id;
      this.edit(division);
    }
  }

  private edit(division: Division): void {
    this.hierarchyService.update(division).subscribe(response => {
      this.dialogRef.close(response);
    }, error => {
      this.toast.error('Error', error.error.message);
    });
  }

  private create(division: Division): void {
    this.hierarchyService.store(division)
      .subscribe(response => {
        this.dialogRef.close(response);
      }, error => {
        this.toast.error('Error', error.error.message);
      });
  }

  loadParents(level: DivisionLevel): void {
    if (level.position === 1) {
      this.parents = [];
    }
    if (level.position === 2) {
      this.hierarchyService.getAllByLevelPosition(1).subscribe(response => {
        this.parents = response.data;
      });
    }
    if (level.position === 3) {
      this.hierarchyService.getAllByLevelPosition(2).subscribe(response => {
        this.parents = response.data;
      });
    }
    if (level.position === 4) {
      this.hierarchyService.getAllByLevelPosition(3).subscribe(response => {
        this.parents = response.data;
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  trackLevelId(index: number, item: DivisionLevel): number {
    return item.id;
  }

  trackParentId(index: number, item: Division): number {
    return item.id;
  }
}
