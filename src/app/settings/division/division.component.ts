import {Component, OnInit} from '@angular/core';
import {ITreeOptions} from '@circlon/angular-tree-component';
import {DivisionService} from './division.service';
import {Division, DivisionTree} from './division';
import {FormComponent} from './form/form.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CustomResponse} from "../../shared/custom-response";
import Swal from 'sweetalert2';
import {ToastService} from "../../shared/services/toast.service";

@Component({
  selector: 'app-division',
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.scss']
})
export class DivisionComponent implements OnInit {
  options: ITreeOptions = {
    useCheckbox: false,
  };
  activatedHierarchy: Division;
  nodes: DivisionTree[];

  constructor(private divisionService: DivisionService,
              private toast: ToastService,
              private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.loadCurrentUserTree();
  }

  loadCurrentUserTree(): void {
    this.divisionService.getCurrentUserTree().subscribe(response => {
      this.nodes = response.data;
    });
  }

  createOrUpdate(row?: Division): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = {
      division: row ? row : undefined
    };
    const dl = this.dialog.open(FormComponent, dialogConfig);
    dl.afterClosed().subscribe((response: CustomResponse) => {
      if (response) {
        this.loadCurrentUserTree();
        this.toast.success('Success!',response.message);
      }
    });
  }

  select(event: any) {
    this.activatedHierarchy = event.node.data as Division;
  }

  delete(row: Division): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this process!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.divisionService.delete(row.id)
          .subscribe((response) => {
            this.loadCurrentUserTree();
            this.toast.success('Success!',response.message);
          });
      }
    });
  }
}
