import {Injectable} from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {ToastService} from '../shared/services/toast.service';

@Injectable()
export class ServerDownHandlerInterceptor implements HttpInterceptor {
  constructor(private toastService: ToastService) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap({
        error: (error: HttpErrorResponse) => {
          if (error.status === 0) {
            this.toastService.error('Connection refused', 'Server unreachable!. Try again later');
          }
        },
      })
    );
  }
}
