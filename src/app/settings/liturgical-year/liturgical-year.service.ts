import {Injectable} from '@angular/core';
import {CustomResponse} from "../../shared/custom-response";
import {Observable} from 'rxjs';
import {LiturgicalYear} from './liturgical-year';
import {environment} from '../../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LiturgicalYearService {
  private readonly URL = environment.api + '/liturgicalYears';

  constructor(private http: HttpClient) {
  }

  public activate(financialYear: LiturgicalYear): Observable<CustomResponse> {
    return this.http.post(this.URL + '/activate', financialYear) as Observable<CustomResponse>;
  }

  public openLiturgicalYears(): Observable<CustomResponse> {
    return this.http.get(this.URL + '/openLiturgicalYears') as Observable<CustomResponse>;
  }

  public currentLiturgicalYear(): Observable<CustomResponse> {
    return this.http.get(this.URL + '/currentLiturgicalYear') as Observable<CustomResponse>;
  }

  public companyCurrentLiturgicalYear(companyId: number): Observable<CustomResponse> {
    return this.http.get(this.URL + '/companyCurrentLiturgicalYear/' + companyId) as Observable<CustomResponse>;
  }

  public usableLiturgicalYears(): Observable<CustomResponse> {
    return this.http.get(this.URL + '/usableLiturgicalYears') as Observable<CustomResponse>;
  }

  public currentAndFutureYears(): Observable<CustomResponse> {
    return this.http.get(this.URL + '/currentAndFutureYears') as Observable<CustomResponse>;
  }

  public setPlanningLiturgicalYear(id: number): Observable<CustomResponse> {
    return this.http.get(this.URL + '/setPlanningLiturgicalYear/' + id) as Observable<CustomResponse>;
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

  public store(financialYear: LiturgicalYear): Observable<CustomResponse> {
    return this.http.post(this.URL, financialYear) as Observable<CustomResponse>;
  }

  public update(financialYear: LiturgicalYear): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + financialYear.id, financialYear) as Observable<CustomResponse>;
  }

  delete(id: number): Observable<{}> {
    return this.http.delete(this.URL + '/' + id);
  }
}
