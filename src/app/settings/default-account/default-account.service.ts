import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DefaultAccount} from './default-account';
import {environment} from '../../../environments/environment.prod';
import {CustomResponse} from '../../utils/custom-response';

@Injectable({
  providedIn: 'root'
})
export class DefaultAccountService {
  private readonly URL = environment.api + '/defaultAccounts';

  constructor(private http: HttpClient) {
  }

  getAll(queryString: string, page = 0, size = 0): Observable<CustomResponse> {
    return this.http.get<any>(this.URL, {
      params: {
        page: `${page}`,
        size: `${size}`,
        query: `${queryString}`,
      }
    });
  }

  public store(setting: DefaultAccount): Observable<CustomResponse> {
    return this.http.post(this.URL, setting) as Observable<CustomResponse>;
  }

  public update(setting: DefaultAccount): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + setting.id, setting) as Observable<CustomResponse>;
  }

  delete(id: number): Observable<{}> {
    return this.http.delete(this.URL + '/' + id);
  }
}
