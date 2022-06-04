import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})

export class SnackbarService {
  constructor(private snackbarSvc: MatSnackBar) { }
  // default configuration
  success(message: string, action: string) {
    this.snackbarSvc.open(message, action, {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: ['success']
    });
  }
}
