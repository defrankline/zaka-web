import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AccountSubType} from './account-sub-type';
import {environment} from '../../../environments/environment.prod';
import {CustomResponse} from '../../utils/custom-response';

@Injectable({
  providedIn: 'root'
})
export class AccountSubTypeService {

  private readonly URL = environment.api + '/accountSubTypes';

  constructor(private http: HttpClient) {
  }

  public getAllByAccountTypeId(accountTypeId: number): Observable<CustomResponse> {
    return this.http.get(this.URL + '/getAllByAccountTypeId/' + accountTypeId) as Observable<CustomResponse>;
  }

  getAll(queryString = '_', accountTypeId = 0, page = 0, size = 0): Observable<CustomResponse> {
    return this.http.get<any>(this.URL, {
      params: {
        page: `${page}`,
        size: `${size}`,
        accountTypeId: `${accountTypeId}`,
        query: `${queryString}`,
      }
    });
  }

  public store(accountSubType: AccountSubType): Observable<CustomResponse> {
    return this.http.post(this.URL, accountSubType) as Observable<CustomResponse>;
  }

  public update(accountSubType: AccountSubType): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + accountSubType.id, accountSubType) as Observable<CustomResponse>;
  }

  delete(id: number): Observable<{}> {
    return this.http.delete(this.URL + '/' + id);
  }
}
