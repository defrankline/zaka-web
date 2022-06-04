import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomResponse} from "../../shared/custom-response";
import {Division} from './division';

@Injectable({
  providedIn: 'root'
})
export class DivisionService {
  private readonly URL = environment.api + '/divisions';

  constructor(private http: HttpClient) {
  }

  getAll(query = '_', page = 0, size = 0): Observable<CustomResponse> {
    return this.http.get<CustomResponse>(this.URL, {
      params: {
        page: `${page}`,
        size: `${size}`,
        query: `${query}`,
      }
    });
  }

  dashboardStat(): Observable<CustomResponse> {
    return this.http.get<CustomResponse>(this.URL + '/stats');
  }

  getAllByLevelPosition(position: number, page = 0, size = 0): Observable<CustomResponse> {
    return this.http.get<CustomResponse>(this.URL + '/getAllByLevelPosition', {
      params: {
        position: `${position}`,
        page: `${page}`,
        size: `${size}`,
      }
    });
  }

  public getCurrentUserAdminDivision(): Observable<CustomResponse> {
    return this.http.get(this.URL + '/getCurrentUserAdminDivision') as Observable<CustomResponse>;
  }

  get(id: number): Observable<CustomResponse> {
    return this.http.get<CustomResponse>(this.URL + '/' + id);
  }

  getCurrentUserTree(): Observable<CustomResponse> {
    return this.http.get<CustomResponse>(this.URL + '/currentUserTree');
  }

  getCurrentUserTopNode(): Observable<CustomResponse> {
    return this.http.get<CustomResponse>(this.URL + '/currentUserTopNode');
  }

  public store(item: Division): Observable<CustomResponse> {
    return this.http.post(this.URL, item) as Observable<CustomResponse>;
  }

  public update(item: Division): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + item.id, item) as Observable<CustomResponse>;
  }

  delete(id: number): Observable<CustomResponse> {
    return this.http.delete(this.URL + '/' + id) as Observable<CustomResponse>;
  }
}
