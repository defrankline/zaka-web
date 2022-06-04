import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomResponse} from '../../utils/custom-response';
import {Contribution} from './contribution';

@Injectable({
  providedIn: 'root'
})
export class ContributionService {
  private readonly URL = environment.api + '/contributions';

  constructor(private http: HttpClient) {
  }

  public getAll(queryString = '_', page = 0, size = 0): Observable<CustomResponse> {
    return this.http.get(this.URL, {
      params: {
        query: `${queryString}`,
        page: `${page}`,
        size: `${size}`,
      }
    }) as Observable<CustomResponse>;
  }

  public store(item: Contribution): Observable<CustomResponse> {
    return this.http.post(this.URL, item) as Observable<CustomResponse>;
  }

  public update(item: Contribution): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + item.id, item) as Observable<CustomResponse>;
  }

  public delete(id: number): Observable<CustomResponse> {
    return this.http.delete(this.URL + '/' + id) as Observable<CustomResponse>;
  }
}
