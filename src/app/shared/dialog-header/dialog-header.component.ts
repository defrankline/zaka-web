import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LabelAction} from '../base-table/label-action';

@Component({
  selector: 'app-dialog-header',
  templateUrl: './dialog-header.component.html',
  styleUrls: ['./dialog-header.component.scss']
})
export class DialogHeaderComponent {
  @Input() title: string;
  @Input() headerActions: LabelAction[];
  @Output('onAction') emitter = new EventEmitter();

  emit(action: any): void {
    this.emitter.emit(action);
  }
}
