import {Injectable} from '@angular/core';
import {ApiConfig} from '../../../shared';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomResponse} from '../../../shared/custom-response';
import {Objective} from './objective';

@Injectable({
  providedIn: 'root'
})
export class ObjectiveService {
  private readonly URL = ApiConfig.url + '/budgetObjectives';

  constructor(private http: HttpClient) {
  }

  getAll(planId = 0, page = 0, size = 0): Observable<CustomResponse> {
    return this.http.get<any>(this.URL, {
      params: {
        page: `${page}`,
        size: `${size}`,
        planId: `${planId}`,
      }
    });
  }

  getAllByFinancialYear(financialYearId: number, page = 0, size = 0): Observable<CustomResponse> {
    return this.http.get<any>(this.URL + '/getAllByFinancialYear', {
      params: {
        financialYearId: `${financialYearId}`,
        page: `${page}`,
        size: `${size}`,
      }
    });
  }

  public create(item: Objective): Observable<CustomResponse> {
    return this.http.post(this.URL, item) as Observable<CustomResponse>;
  }

  public update(item: Objective): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + item.id, item) as Observable<CustomResponse>;
  }

  delete(id: number): Observable<CustomResponse> {
    return this.http.delete(this.URL + '/' + id) as Observable<CustomResponse>;
  }
}
