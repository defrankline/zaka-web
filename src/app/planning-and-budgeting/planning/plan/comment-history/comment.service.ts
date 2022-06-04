import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiConfig} from '../../../../shared';
import {CustomResponse} from '../../../../shared/custom-response';
import {Comment} from './comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly URL = ApiConfig.url + '/planComments';

  constructor(private http: HttpClient) {
  }

  public getAll(planId: number): Observable<CustomResponse> {
    return this.http.get(this.URL, {
      params: {
        planId: `${planId}`
      }
    }) as Observable<CustomResponse>;
  }

  getAllPaged(planId: number, page: number, size: number): Observable<CustomResponse> {
    return this.http.get<any>(this.URL + '/page', {
      params: {
        planId: `${planId}`,
        page: `${page}`,
        size: `${size}`
      }
    });
  }

  public store(item: Comment): Observable<CustomResponse> {
    return this.http.post(this.URL, item) as Observable<CustomResponse>;
  }

  public update(item: Comment): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + item.id, item) as Observable<CustomResponse>;
  }

  delete(id: number): Observable<CustomResponse> {
    return this.http.delete(this.URL + '/' + id) as Observable<CustomResponse>;
  }
}
