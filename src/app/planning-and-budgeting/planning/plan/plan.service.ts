import {Injectable} from '@angular/core';
import {ApiConfig} from '../../../shared';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomResponse} from '../../../shared/custom-response';
import {Objective} from '../objective/objective';
import {FinancialYear} from '../../../setup-and-configuration/cooperative/financial-year/financial-year';
import {Plan} from './plan';
import {Rejection} from '../../../shared/model/rejection';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private readonly URL = ApiConfig.url + '/financialYearPlans';

  constructor(private http: HttpClient) {
  }

  getAll(financialYearId = 0, page = 0, size = 0): Observable<CustomResponse> {
    return this.http.get<any>(this.URL, {
      params: {
        page: `${page}`,
        size: `${size}`,
        financialYearId: `${financialYearId}`,
      }
    });
  }

  view(id: number): Observable<CustomResponse> {
    return this.http.get<any>(this.URL + '/view', {
      params: {
        id: `${id}`
      }
    });
  }

  public create(item: Plan): Observable<CustomResponse> {
    return this.http.post(this.URL, item) as Observable<CustomResponse>;
  }

  public update(item: Plan): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + item.id, item) as Observable<CustomResponse>;
  }

  public copy(id: number, destinationFinancialYear: FinancialYear): Observable<CustomResponse> {
    return this.http.post(this.URL + '/copy/' + id, destinationFinancialYear) as Observable<CustomResponse>;
  }

  delete(id: number): Observable<CustomResponse> {
    return this.http.delete(this.URL + '/' + id) as Observable<CustomResponse> as Observable<CustomResponse>;
  }

  public approve(id: number, file: any): Observable<CustomResponse> {
    return this.http.post(this.URL + '/approve', {id, file}) as Observable<CustomResponse>;
  }

  public sendBackToCommittee(item: Rejection): Observable<CustomResponse> {
    return this.http.post(this.URL + '/sendBackToCommittee', item) as Observable<CustomResponse>;
  }

  public sendBackToDco(item: Rejection): Observable<CustomResponse> {
    return this.http.post(this.URL + '/sendBackToDco', item) as Observable<CustomResponse>;
  }

  public sendToRegistrar(id: number): Observable<CustomResponse> {
    return this.http.get(this.URL + '/sendToRegistrar', {
      params: {
        id: `${id}`,
      }
    }) as Observable<CustomResponse>;
  }

  public sendToDco(id: number): Observable<CustomResponse> {
    return this.http.get(this.URL + '/sendToDco', {
      params: {
        id: `${id}`,
      }
    }) as Observable<CustomResponse>;
  }

  public committeeDocument(id: number): Observable<CustomResponse> {
    return this.http.get(this.URL + '/committeeDocument/' + id) as Observable<CustomResponse>;
  }

  public registrarDocument(id: number): Observable<CustomResponse> {
    return this.http.get(this.URL + '/registrarDocument/' + id) as Observable<CustomResponse>;
  }

  public print(id: number): any {
    return this.http.get(this.URL + '/downloadBudget/' + id, {
      params: {
        savingId: `${id}`,
      },
      responseType: 'arraybuffer'
    });
  }
}
