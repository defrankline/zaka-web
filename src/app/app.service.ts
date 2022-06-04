import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private readonly userLoggedIn = new Subject<boolean>();

  constructor() {
    this.userLoggedIn.next(false);
  }

  setUserLoggedIn(userLoggedIn: boolean): void {
    this.userLoggedIn.next(userLoggedIn);
  }

  getUserLoggedIn(): Observable<boolean> {
    return this.userLoggedIn.asObservable();
  }
}
