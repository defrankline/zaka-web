import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomResponse} from "../../shared/custom-response";
import {DivisionLevel} from './level';

@Injectable({
  providedIn: 'root'
})
export class DivisionLevelService {
  private readonly URL = environment.api + '/divisionLevels';

  constructor(private http: HttpClient) {
  }

  getAll(page = 0, size = 0): Observable<CustomResponse> {
    return this.http.get<CustomResponse>(this.URL, {
      params: {
        page: `${page}`,
        size: `${size}`,
      }
    });
  }

  get(id: number): Observable<CustomResponse> {
    return this.http.get<CustomResponse>(this.URL + '/' + id);
  }

  public store(item: DivisionLevel): Observable<CustomResponse> {
    return this.http.post(this.URL, item) as Observable<CustomResponse>;
  }

  public update(item: DivisionLevel): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + item.id, item) as Observable<CustomResponse>;
  }

  delete(id: number): Observable<CustomResponse> {
    return this.http.delete(this.URL + '/' + id) as Observable<CustomResponse>;
  }
}
