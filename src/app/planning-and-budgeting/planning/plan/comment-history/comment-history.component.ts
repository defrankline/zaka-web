import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';
import {CommentService} from './comment.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Comment} from './comment';
import {Plan} from '../plan';
import {ToastService} from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-comment-history',
  templateUrl: './comment-history.component.html',
  styleUrls: ['./comment-history.component.scss']
})
export class CommentHistoryComponent implements OnInit {
  plan: Plan;
  itemListSubject: BehaviorSubject<Comment[]> = new BehaviorSubject([]);

  constructor(private dialogRef: MatDialogRef<CommentHistoryComponent>,
              private commentService: CommentService,
              private sanitizer: DomSanitizer,
              private toastService: ToastService,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.plan = data.plan;
  }


  ngOnInit(): void {
    this.loadComments(this.plan.id);
  }

  loadComments(id: number): void {
    this.commentService.getAll(id).subscribe(response => {
      this.itemListSubject.next(response.data);
    });
  }

  getItems(): Observable<Comment[]> {
    return this.itemListSubject.asObservable();
  }

  close(): void {
    this.dialogRef.close();
  }
}
