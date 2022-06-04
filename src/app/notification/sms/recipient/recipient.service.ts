import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Recipient} from './recipient';
import {environment} from '../../../../environments/environment.prod';
import {CustomResponse} from "../../../shared/custom-response";

@Injectable({
  providedIn: 'root'
})
export class RecipientService {
  private readonly URL = environment.api + '/smsRecipients';

  constructor(private http: HttpClient) {
  }

  public getAll(smsId: number): Observable<CustomResponse> {
    return this.http.get(this.URL, {
      params: {
        smsId: `${smsId}`,
      }
    }) as Observable<CustomResponse>;
  }

  getAllPaged(smsId: number, page: number, size: number): Observable<CustomResponse> {
    return this.http.get<any>(this.URL + '/page', {
      params: {
        smsId: `${smsId}`,
        page: `${page}`,
        size: `${size}`,
      }
    });
  }

  public store(item: Recipient): Observable<CustomResponse> {
    return this.http.post(this.URL, item) as Observable<CustomResponse>;
  }

  public update(item: Recipient): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + item.id, item) as Observable<CustomResponse>;
  }

  delete(id: number): Observable<{}> {
    return this.http.delete(this.URL + '/' + id);
  }
}
