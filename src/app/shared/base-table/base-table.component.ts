import {Component, Input, Output, EventEmitter} from '@angular/core';
import {LabelAction} from './label-action';
import {ApiConfig} from '../api.config';
import {PageEvent} from '@angular/material/paginator';
import {NgxPermissionsService} from 'ngx-permissions';


@Component({
  selector: 'app-base-table',
  templateUrl: './base-table.component.html',
  styleUrls: ['./base-table.component.scss']
})
export class BaseTableComponent<A> {
  @Output('onAction') emitter = new EventEmitter();
  @Output('onPageChange') pageChangeEmitter = new EventEmitter();
  @Input('data') dataSource: A[];
  @Input('cols') tableCols = [];
  @Input('title') title = '';
  @Input('headerActions') headerActions: LabelAction[];

  @Input('page') page = ApiConfig.page;
  @Input('size') size = ApiConfig.size;
  @Input('perPageOptions') perPageOptions = ApiConfig.perPageOptions;
  @Input('totalItems') totalItems = 0;

  get keys(): any {
    return this.tableCols.map(({key}) => key);
  }

  showBooleanValue(elt, column): any {
    return column.config.values[`${elt[column.key]}`];
  }

  emit(data: any): void {
    this.emitter.emit(data);
  }

  pageChanged(pageEvent: PageEvent): void {
    this.page = pageEvent.pageIndex;
    this.size = pageEvent.pageSize;
    this.pageChangeEmitter.emit(pageEvent);
  }
}
