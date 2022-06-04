import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomResponse} from '../../utils/custom-response';
import {Role} from './role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly URL = environment.api + '/roles';

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

  public getAllExcept(queryString: string, exceptIdString: number[]): Observable<CustomResponse> {
    const arr = [];
    exceptIdString.map(row => {
      arr.push(row);
    });
    return this.http.get(this.URL + '/getAllExcept', {
      params: {
        exceptIds: `${arr}`
      }
    }) as Observable<CustomResponse>;
  }

  get(id: number): Observable<CustomResponse> {
    return this.http.get<CustomResponse>(this.URL + '/' + id);
  }

  public store(item: Role): Observable<CustomResponse> {
    return this.http.post(this.URL, item) as Observable<CustomResponse>;
  }

  public update(item: Role): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + item.id, item) as Observable<CustomResponse>;
  }

  delete(id: number): Observable<CustomResponse> {
    return this.http.delete(this.URL + '/' + id) as Observable<CustomResponse>;
  }
}
