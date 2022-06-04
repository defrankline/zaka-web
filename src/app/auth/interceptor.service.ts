import {Injectable} from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {StorageService} from "./storage.service";
import {StorageKey} from "./storage.model";

const {AUTH_TOKEN} = StorageKey;

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  token: string;

  constructor(private authService: AuthService, private storage: StorageService) {
    this.token = this.storage.read(AUTH_TOKEN) || '';
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    let token: string = this.authService.getToken();
    if (token === null || token === '') {
      token = this.token;
    }
    if (token) {
      req = req.clone({
        setHeaders: {Authorization: `Bearer ${token}`},
      });
    }

    return next.handle(req);
  }
}
