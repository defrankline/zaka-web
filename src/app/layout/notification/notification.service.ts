import {Injectable} from '@angular/core';
import {ApiConfig} from '../../shared';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomResponse} from '../../shared/custom-response';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly URL = ApiConfig.url + '/notifications';

  constructor(private http: HttpClient) {
  }

  public getAll(): Observable<CustomResponse> {
    return this.http.get(this.URL) as Observable<CustomResponse>;
  }

  getAllPaged(page: number, size: number): Observable<CustomResponse> {
    return this.http.get<any>(this.URL + '/page', {
      params: {
        page: `${page}`,
        size: `${size}`,
      }
    });
  }

  public getAllNew(): Observable<CustomResponse> {
    return this.http.get(this.URL + '/getAllNew') as Observable<CustomResponse>;
  }

  public getAllNewPaged(page: number, size: number): Observable<CustomResponse> {
    return this.http.get(this.URL + '/getAllNew/page', {
      params: {
        page: `${page}`,
        size: `${size}`,
      }
    }) as Observable<CustomResponse>;
  }

  public read(): Observable<CustomResponse> {
    return this.http.get(this.URL + '/read') as Observable<CustomResponse>;
  }
}
