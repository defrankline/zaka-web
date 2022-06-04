import {Injectable} from '@angular/core';
import {ApiConfig} from '../../shared';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomResponse} from '../../shared/custom-response';
import {Projection} from './budget';

@Injectable({
  providedIn: 'root'
})
export class ProjectionService {
  private readonly URL = ApiConfig.url + '/projections';

  constructor(private http: HttpClient) {
  }

  public getAll(budgetId: number): Observable<CustomResponse> {
    return this.http.get(this.URL, {
      params: {
        budgetId: `${budgetId}`,
      }
    }) as Observable<CustomResponse>;
  }

  public approvedItems(gfsCodeType: string): Observable<CustomResponse> {
    return this.http.get(this.URL + '/approvedItems', {
      params: {
        gfsCodeType: `${gfsCodeType}`,
      }
    }) as Observable<CustomResponse>;
  }

  getAllPaged(budgetId: number, page: number, size: number): Observable<CustomResponse> {
    return this.http.get<any>(this.URL + '/page', {
      params: {
        page: `${page}`,
        size: `${size}`,
        budgetId: `${budgetId}`,
      }
    });
  }

  public store(item: Projection): Observable<CustomResponse> {
    return this.http.post(this.URL, item) as Observable<CustomResponse>;
  }

  public update(item: Projection): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + item.id, item) as Observable<CustomResponse>;
  }

  delete(id: number): Observable<CustomResponse> {
    return this.http.delete(this.URL + '/' + id) as Observable<CustomResponse> as Observable<CustomResponse>;
  }
}
