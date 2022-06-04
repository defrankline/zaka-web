import {Injectable} from '@angular/core';
import {ApiConfig} from '../../../shared';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AssetCategory} from '../../../setup-and-configuration/asset-management/asset-category/asset-category';
import {CustomResponse} from '../../../shared/custom-response';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly URL = ApiConfig.url + '/budgetComments';

  constructor(private http: HttpClient) {
  }

  public getAll(budgetId: number): Observable<CustomResponse> {
    return this.http.get(this.URL, {
      params: {
        budgetId: `${budgetId}`
      }
    }) as Observable<CustomResponse>;
  }

  getAllPaged(budgetId: number, page: number, size: number): Observable<CustomResponse> {
    return this.http.get<any>(this.URL + '/page', {
      params: {
        budgetId: `${budgetId}`,
        page: `${page}`,
        size: `${size}`
      }
    });
  }

  public store(item: AssetCategory): Observable<CustomResponse> {
    return this.http.post(this.URL, item) as Observable<CustomResponse>;
  }

  public update(item: AssetCategory): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + item.id, item) as Observable<CustomResponse>;
  }

  delete(id: number): Observable<CustomResponse> {
    return this.http.delete(this.URL + '/' + id) as Observable<CustomResponse>;
  }
}
