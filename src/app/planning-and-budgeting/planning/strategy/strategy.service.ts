import {Injectable} from '@angular/core';
import {ApiConfig} from '../../../shared';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomResponse} from '../../../shared/custom-response';
import {Strategy} from './strategy';

@Injectable({
  providedIn: 'root'
})
export class StrategyService {
  private readonly URL = ApiConfig.url + '/budgetObjectiveTargetStrategies';

  constructor(private http: HttpClient) {
  }

  getAll(page = 0, size = 0, targetId = 0): Observable<CustomResponse> {
    return this.http.get<any>(this.URL, {
      params: {
        targetId: `${targetId}`,
        page: `${page}`,
        size: `${size}`,
      }
    });
  }

  getAllByTarget(targetId: number, page = 0, size = 0): Observable<CustomResponse> {
    return this.http.get<any>(this.URL + '/getAllByTarget', {
      params: {
        targetId: `${targetId}`,
        page: `${page}`,
        size: `${size}`,
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

  getAllByPlan(planId: number, page = 0, size = 0): Observable<CustomResponse> {
    return this.http.get<any>(this.URL + '/getAllByPlan', {
      params: {
        planId: `${planId}`,
        page: `${page}`,
        size: `${size}`,
      }
    });
  }

  getAllByObjective(objectiveId: number, page = 0, size = 0): Observable<CustomResponse> {
    return this.http.get<any>(this.URL + '/getAllByObjective', {
      params: {
        objectiveId: `${objectiveId}`,
        page: `${page}`,
        size: `${size}`,
      }
    });
  }


  public create(item: Strategy): Observable<CustomResponse> {
    return this.http.post(this.URL, item) as Observable<CustomResponse>;
  }

  public update(item: Strategy): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + item.id, item) as Observable<CustomResponse>;
  }

  delete(id: number): Observable<CustomResponse> {
    return this.http.delete(this.URL + '/' + id) as Observable<CustomResponse>;
  }
}
