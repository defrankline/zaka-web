import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AccountGroup} from './account-group';
import {environment} from '../../../environments/environment.prod';
import {CustomResponse} from '../../utils/custom-response';

@Injectable({
  providedIn: 'root'
})
export class AccountGroupService {

  private readonly URL = environment.api + '/accountGroups';

  constructor(private http: HttpClient) {
  }

  public getAllByAccountSubTypeId(accountSubTypeId: number): Observable<CustomResponse> {
    return this.http.get(this.URL + '/getAllByAccountSubTypeId/' + accountSubTypeId) as Observable<CustomResponse>;
  }


  getAll(queryString: string, accountSubTypeId = 0, page = 0, size = 0): Observable<CustomResponse> {
    return this.http.get<any>(this.URL, {
      params: {
        page: `${page}`,
        size: `${size}`,
        accountSubTypeId: `${accountSubTypeId}`,
        query: `${queryString}`,
      }
    });
  }

  public store(accountGroup: AccountGroup): Observable<CustomResponse> {
    return this.http.post(this.URL, accountGroup) as Observable<CustomResponse>;
  }

  public update(accountGroup: AccountGroup): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + accountGroup.id, accountGroup) as Observable<CustomResponse>;
  }

  delete(id: number): Observable<{}> {
    return this.http.delete(this.URL + '/' + id);
  }
}
