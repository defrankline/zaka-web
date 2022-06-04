import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AccountType} from './account-type';
import {environment} from '../../../environments/environment.prod';
import {BalanceNatureItem} from '../account/ledger-account';
import {CustomResponse} from "../../shared/custom-response";

@Injectable({
  providedIn: 'root'
})
export class AccountTypeService {

  private readonly URL = environment.api + '/accountTypes';

  constructor(private http: HttpClient) {
  }

  public balanceNatureList(): BalanceNatureItem[] {
    return [
      {id: 'DEBIT', name: 'Debit'},
      {id: 'CREDIT', name: 'Credit'},
    ];
  }

  getAll(queryString = '_', page = 0, size = 0): Observable<CustomResponse> {
    return this.http.get<any>(this.URL, {
      params: {
        page: `${page}`,
        size: `${size}`,
        query: `${queryString}`,
      }
    });
  }

  public store(accountType: AccountType): Observable<CustomResponse> {
    return this.http.post(this.URL, accountType) as Observable<CustomResponse>;
  }

  public update(accountType: AccountType): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + accountType.id, accountType) as Observable<CustomResponse>;
  }

  delete(id: number): Observable<{}> {
    return this.http.delete(this.URL + '/' + id);
  }
}
