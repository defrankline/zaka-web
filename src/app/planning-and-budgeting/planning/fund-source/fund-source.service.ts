import {Injectable} from '@angular/core';
import {ApiConfig} from '../../../shared';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomResponse} from '../../../shared/custom-response';
import {FundSource} from './fund-source';

@Injectable({
  providedIn: 'root'
})
export class FundSourceService {
  private readonly URL = ApiConfig.url + '/fundSources';

  constructor(private http: HttpClient) {
  }

  public getOne(id: number): Observable<CustomResponse> {
    return this.http.get(this.URL + '/' + id) as Observable<CustomResponse>;
  }

  getAll(query = '_', page = 0, size = 0): Observable<CustomResponse> {
    return this.http.get<any>(this.URL, {
      params: {
        page: `${page}`,
        size: `${size}`,
        query: `${query}`,
      }
    });
  }

  public create(item: FundSource): Observable<CustomResponse> {
    return this.http.post(this.URL, item) as Observable<CustomResponse>;
  }

  public update(item: FundSource): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + item.id, item) as Observable<CustomResponse>;
  }

  delete(id: number): Observable<CustomResponse> {
    return this.http.delete(this.URL + '/' + id) as Observable<CustomResponse> as Observable<CustomResponse>;
  }

}
