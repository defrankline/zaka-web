import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiConfig} from '../shared';
import {CustomResponse} from '../shared/custom-response';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly URL = ApiConfig.url + '/dashboard';

  constructor(private http: HttpClient) {
  }

  public manager(): Observable<CustomResponse> {
    return this.http.get(this.URL + '/manager') as Observable<CustomResponse>;
  }
}
