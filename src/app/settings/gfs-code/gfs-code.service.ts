import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GfsCode} from './gfs-code';
import {environment} from '../../../environments/environment.prod';
import {CustomResponse} from '../../utils/custom-response';

@Injectable({
  providedIn: 'root'
})
export class GfsCodeService {
  private readonly URL = environment.api + '/gfsCodes';

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

  public getAllByGfsCodeType(gfsCodeType: string, queryString = '_', page = 0, size = 0): Observable<CustomResponse> {
    return this.http.get(this.URL + '/findAllGfsCodeType', {
      params: {
        gfsCodeType: `${gfsCodeType}`,
        query: `${queryString}`,
        page: `${page}`,
        size: `${size}`,
      }
    }) as Observable<CustomResponse>;
  }

  public getAllByTreatment(treatment: string, queryString = '_', page = 0, size = 0): Observable<CustomResponse> {
    return this.http.get(this.URL + '/findAllByTreatment', {
      params: {
        query: `${queryString}`,
        treatment: `${treatment}`,
        page: `${page}`,
        size: `${size}`,
      }
    }) as Observable<CustomResponse>;
  }

  public store(item: GfsCode): Observable<CustomResponse> {
    return this.http.post(this.URL, item) as Observable<CustomResponse>;
  }

  public update(item: GfsCode): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + item.id, item) as Observable<CustomResponse>;
  }

  public delete(id: number): Observable<CustomResponse> {
    return this.http.delete(this.URL + '/' + id) as Observable<CustomResponse>;
  }

  public publish(id: number): Observable<CustomResponse> {
    return this.http.get(this.URL + '/publish/' + id) as Observable<CustomResponse>;
  }

  public sync(): Observable<CustomResponse> {
    return this.http.get(this.URL + '/sync') as Observable<CustomResponse>;
  }
}
