import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PaymentMethod} from './payment-method';
import {environment} from '../../../environments/environment.prod';
import {CustomResponse} from '../../utils/custom-response';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  private readonly URL = environment.api + '/paymentMethods';

  constructor(private http: HttpClient) {
  }

  public search(queryString: string): Observable<CustomResponse> {
    return this.http.get<any>(this.URL + '/search', {
      params: {
        query: `${queryString}`,
      }
    });
  }

  public getAllGlobal(): Observable<CustomResponse> {
    return this.http.get(this.URL + '/global') as Observable<CustomResponse>;
  }

  getAll(queryString = '_', page = 0, size = 0): Observable<CustomResponse> {
    return this.http.get<any>(this.URL, {
      params: {
        page: `${page}`,
        size: `${size}`,
        query: `${queryString}`,
      }
    });
  }

  public store(paymentMethod: PaymentMethod): Observable<CustomResponse> {
    return this.http.post(this.URL, paymentMethod) as Observable<CustomResponse>;
  }

  public update(paymentMethod: PaymentMethod): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + paymentMethod.id, paymentMethod) as Observable<CustomResponse>;
  }

  delete(id: number): Observable<{}> {
    return this.http.delete(this.URL + '/' + id);
  }
}
