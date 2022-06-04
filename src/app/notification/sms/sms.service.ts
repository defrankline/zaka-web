import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BulkSmsDto} from './sms';
import {environment} from '../../../environments/environment.prod';
import {CustomResponse} from "../../shared/custom-response";


@Injectable({
  providedIn: 'root'
})
export class SmsService {
  private readonly URL = environment.api + '/sms';

  constructor(private http: HttpClient) {
  }

  getAll(query = '_', page = 0, size = 0): Observable<CustomResponse> {
    return this.http.get<any>(this.URL, {
      params: {
        query: `${query}`,
        page: `${page}`,
        size: `${size}`,
      }
    });
  }

  publish(id: number): Observable<CustomResponse> {
    return this.http.get<any>(this.URL + '/publish/' + id);
  }

  public store(item: BulkSmsDto): Observable<CustomResponse> {
    return this.http.post(this.URL, item) as Observable<CustomResponse>;
  }

  public update(item: BulkSmsDto): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + item.id, item) as Observable<CustomResponse>;
  }

  delete(id: number): Observable<{}> {
    return this.http.delete(this.URL + '/' + id) as Observable<CustomResponse>;
  }
}
